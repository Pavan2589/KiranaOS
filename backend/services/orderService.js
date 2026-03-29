// services/orderService.js — KiranaOS v3
const { Order, Store, Customer, Rider } = require('../models');
const { routeOrder, findNearestRider, haversine } = require('./router');
const bus = require('./eventBus');

let orderCounter = 41;

async function createOrder(customerId, rawItems) {
  const customer = await Customer.findOne({ id: customerId });
  if (!customer) throw new Error('Customer not found');

  const id = `order_KOS-${String(orderCounter++).padStart(4, '0')}`;
  const items = rawItems.map(i => ({ id: i.id, qty: i.qty, name: i.name || '', price: i.price || 0, emoji: i.emoji || '' }));
  const totalAmount = items.reduce((s, i) => s + (i.price * i.qty), 0);

  const order = await Order.create({
    id, customerId,
    customerSnapshot: { name: customer.name, phone: customer.phone, lat: customer.lat, lng: customer.lng, address: customer.address || '' },
    items, totalAmount, status: 'CREATED', rejectedStores: []
  });

  bus.publish('order:update', { type: 'created', order });
  setTimeout(() => assignOrder(order.id), 300);
  return order;
}

async function assignOrder(orderId) {
  const order = await Order.findOne({ id: orderId });
  if (!order) return;

  const result = await routeOrder(order, order.rejectedStores || []);

  if (!result) {
    await Order.findOneAndUpdate({ id: orderId }, { status: 'CREATED' });
    bus.publish('order:noStore', { orderId, message: 'No eligible store or dark store found' });
    return;
  }

  const { store, distanceMeters, etaMinutes, splitItems } = result;

  // Calculate savings vs a hypothetical dark store at 5km
  const hypotheticalDarkDist = haversine(store.lat, store.lng, order.customerSnapshot.lat, order.customerSnapshot.lng) * 1.8;
  const metersSaved = store.storeType === 'kirana' ? Math.max(0, Math.round(hypotheticalDarkDist - distanceMeters)) : 0;
  const minutesSaved = Math.round(metersSaved / 300);

  const updateData = {
    status: 'ASSIGNED',
    assignedStoreId: store.id,
    assignedStoreName: store.name,
    assignedStoreType: store.storeType,
    distanceMeters, etaMinutes,
    metersSaved, minutesSaved
  };

  if (splitItems) {
    updateData.darkStoreItems = splitItems.darkItems.map(i => ({ ...i, fulfilledBy: 'darkStore' }));
    updateData.items = splitItems.kiranaItems.map(i => ({ ...i, fulfilledBy: 'kirana' }));
  }

  await Order.findOneAndUpdate({ id: orderId }, updateData);
  await Store.findOneAndUpdate({ id: store.id }, { $inc: { activeOrders: 1 } });

  const updated = await Order.findOne({ id: orderId });
  bus.publish('order:new', { event: 'order:new', order: updated, store: store.toObject(), assignment: { orderId, storeId: store.id, storeName: store.name, distanceMeters, etaMinutes } });
  bus.publish('order:update', { type: 'assigned', order: updated });

  // Auto-assign nearest rider
  setTimeout(() => assignRider(orderId, store.lat, store.lng), 500);
}

async function assignRider(orderId, storeLat, storeLng) {
  const rider = await findNearestRider(storeLat, storeLng);
  if (!rider) return;
  await Rider.findOneAndUpdate({ id: rider.id }, { isAvailable: false, activeOrderId: orderId });
  await Order.findOneAndUpdate({ id: orderId }, { assignedRiderId: rider.id });
  const updated = await Order.findOne({ id: orderId });
  bus.publish('rider:assigned', { orderId, riderId: rider.id, riderName: rider.name });
  bus.publish('order:update', { type: 'rider_assigned', order: updated });
}

async function acceptOrder(orderId, storeId) {
  const order = await Order.findOne({ id: orderId });
  if (!order) throw new Error('Order not found');
  if (order.assignedStoreId !== storeId) throw new Error('Store mismatch');
  if (order.status !== 'ASSIGNED') throw new Error(`Cannot accept — status: ${order.status}`);

  // Decrement stock for each accepted item
  const store = await Store.findOne({ id: storeId });
  if (store) {
    for (const item of order.items) {
      await Store.findOneAndUpdate(
        { id: storeId, 'products.id': item.id },
        { $inc: { 'products.$.stock': -item.qty } }
      );
    }
  }

  await Order.findOneAndUpdate({ id: orderId }, { status: 'ACCEPTED' });
  const updated = await Order.findOne({ id: orderId });
  bus.publish('order:accepted', { event: 'order:accepted', orderId, storeId });
  bus.publish('order:update', { type: 'accepted', order: updated });
  return updated;
}

async function rejectOrder(orderId, storeId) {
  const order = await Order.findOne({ id: orderId });
  if (!order) throw new Error('Order not found');
  if (order.assignedStoreId !== storeId) throw new Error('Store mismatch');
  if (order.status !== 'ASSIGNED') throw new Error(`Cannot reject — status: ${order.status}`);

  await Store.findOneAndUpdate({ id: storeId }, { $inc: { activeOrders: -1 } });
  await Order.findOneAndUpdate({ id: orderId }, {
    status: 'CREATED', assignedStoreId: null, assignedStoreName: null,
    $push: { rejectedStores: storeId }
  });

  const updated = await Order.findOne({ id: orderId });
  bus.publish('order:rejected', { event: 'order:rejected', orderId, storeId });
  bus.publish('order:update', { type: 'rejected', order: updated });
  setTimeout(() => assignOrder(orderId), 400);
  return updated;
}

async function deliverOrder(orderId, riderId) {
  const order = await Order.findOne({ id: orderId });
  if (!order) throw new Error('Order not found');
  if (!['ACCEPTED', 'PICKED_UP'].includes(order.status)) throw new Error(`Cannot deliver — status: ${order.status}`);

  if (order.assignedStoreId) {
    await Store.findOneAndUpdate({ id: order.assignedStoreId }, { $inc: { activeOrders: -1 } });
  }

  // Credit rider earnings
  const actualRiderId = riderId || order.assignedRiderId;
  if (actualRiderId) {
    const isKiranaFirst = order.assignedStoreType === 'kirana';
    const baseAmount = Math.round((order.totalAmount || 0) * 0.05 + 15);
    const bonus = isKiranaFirst ? 5 : 0;
    await Rider.findOneAndUpdate({ id: actualRiderId }, {
      isAvailable: true, activeOrderId: null,
      $push: { earnings: { orderId, amount: baseAmount + bonus, bonus, isKiranaFirst, date: new Date() } }
    });
  }

  await Order.findOneAndUpdate({ id: orderId }, { status: 'DELIVERED', deliveredAt: new Date() });
  const updated = await Order.findOne({ id: orderId });
  bus.publish('order:delivered', { event: 'order:delivered', orderId });
  bus.publish('order:update', { type: 'delivered', order: updated });
  return updated;
}

module.exports = { createOrder, assignOrder, acceptOrder, rejectOrder, deliverOrder };
