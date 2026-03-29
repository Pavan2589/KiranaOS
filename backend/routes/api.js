// routes/api.js — KiranaOS v3
const express = require('express');
const r = express.Router();
const { Store, Customer, Rider, Order } = require('../models');
const { createOrder, acceptOrder, rejectOrder, deliverOrder } = require('../services/orderService');
const bus = require('../services/eventBus');
const { ALL_PRODUCTS } = require('../seed/data');

// ── ORDERS ────────────────────────────────────────────────────────────────
r.post('/order', async (req, res) => {
  try {
    const { customerId, items } = req.body;
    if (!customerId || !items?.length) return res.status(400).json({ error: 'customerId and items[] required' });
    const order = await createOrder(customerId, items);
    res.json({ success: true, order });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

r.get('/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
  res.json(orders);
});

r.get('/order/:id', async (req, res) => {
  const order = await Order.findOne({ id: req.params.id });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

r.post('/order/:id/accept', async (req, res) => {
  try {
    const order = await acceptOrder(req.params.id, req.body.storeId);
    res.json({ success: true, order });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

r.post('/order/:id/reject', async (req, res) => {
  try {
    const order = await rejectOrder(req.params.id, req.body.storeId);
    res.json({ success: true, order });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

r.post('/order/:id/deliver', async (req, res) => {
  try {
    const order = await deliverOrder(req.params.id, req.body.riderId);
    res.json({ success: true, order });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

r.post('/order/:id/pickup', async (req, res) => {
  try {
    await Order.findOneAndUpdate({ id: req.params.id }, { status: 'PICKED_UP' });
    const updated = await Order.findOne({ id: req.params.id });
    bus.publish('order:update', { type: 'picked_up', order: updated });
    res.json({ success: true, order: updated });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

// ── STORES ────────────────────────────────────────────────────────────────
r.get('/stores', async (req, res) => {
  const filter = req.query.all ? {} : { isOnline: true, 'verification.isVerified': true };
  res.json(await Store.find(filter));
});

r.get('/store/:id', async (req, res) => {
  const store = await Store.findOne({ id: req.params.id });
  if (!store) return res.status(404).json({ error: 'Not found' });
  res.json(store);
});

r.get('/store/:id/orders', async (req, res) => {
  const { status } = req.query;
  const filter = { assignedStoreId: req.params.id };
  if (status) filter.status = status;
  res.json(await Order.find(filter).sort({ createdAt: -1 }));
});

// Store analytics
r.get('/store/:id/analytics', async (req, res) => {
  try {
    const orders = await Order.find({ assignedStoreId: req.params.id, status: 'DELIVERED' });
    const today = new Date(); today.setHours(0,0,0,0);
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const todayRevenue = todayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    // Top products
    const itemMap = {};
    orders.forEach(o => o.items.forEach(i => { itemMap[i.name] = (itemMap[i.name] || 0) + i.qty; }));
    const topProducts = Object.entries(itemMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,qty])=>({name,qty}));
    res.json({ totalOrders: orders.length, todayOrders: todayOrders.length, revenue, todayRevenue, topProducts });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

r.post('/store/status', async (req, res) => {
  try {
    const { storeId, isOnline } = req.body;
    const store = await Store.findOneAndUpdate({ id: storeId }, { isOnline }, { new: true });
    if (!store) return res.status(404).json({ error: 'Store not found' });
    bus.publish('store:status', { event: 'store:status', storeId, isOnline, store });
    res.json({ success: true, store });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

// ── CUSTOMERS ─────────────────────────────────────────────────────────────
r.get('/customers', async (req, res) => res.json(await Customer.find()));
r.get('/customer/:id', async (req, res) => {
  const c = await Customer.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json(c);
});
r.get('/customer/:id/orders', async (req, res) => {
  res.json(await Order.find({ customerId: req.params.id }).sort({ createdAt: -1 }));
});
r.get('/customer/:id/savings', async (req, res) => {
  const orders = await Order.find({ customerId: req.params.id, status: 'DELIVERED' });
  const totalMetersSaved = orders.reduce((s,o) => s + (o.metersSaved||0), 0);
  const totalMinutesSaved = orders.reduce((s,o) => s + (o.minutesSaved||0), 0);
  const kiranaOrders = orders.filter(o => o.assignedStoreType === 'kirana').length;
  res.json({ totalMetersSaved, totalMinutesSaved, kiranaOrders, totalOrders: orders.length });
});

// ── RIDERS ────────────────────────────────────────────────────────────────
r.get('/riders', async (req, res) => res.json(await Rider.find()));
r.post('/rider/status', async (req, res) => {
  const { riderId, isOnline, isAvailable } = req.body;
  const rider = await Rider.findOneAndUpdate({ id: riderId }, { isOnline, isAvailable }, { new: true });
  res.json({ success: true, rider });
});

// ── PRODUCTS ──────────────────────────────────────────────────────────────
r.get('/products', (req, res) => res.json(ALL_PRODUCTS));

// Product availability across stores (for customer UI)
r.get('/products/availability', async (req, res) => {
  const stores = await Store.find({ isOnline: true, 'verification.isVerified': true });
  const map = {};
  stores.forEach(store => {
    store.products.forEach(p => {
      if (!map[p.id]) map[p.id] = [];
      map[p.id].push({ storeId: store.id, storeName: store.name, storeType: store.storeType, lat: store.lat, lng: store.lng, stock: p.stock });
    });
  });
  res.json(map);
});

// ── PLATFORM WEBHOOKS ─────────────────────────────────────────────────────
r.post('/blinkit/webhook', async (req, res) => {
  try {
    const raw = req.body;
    const customerId = raw.customer_id || raw.customerId || 'cust_001';
    const items = (raw.line_items || raw.items || []).map(i => ({ id: i.item_id || i.id, qty: i.quantity || i.qty || 1, name: i.name || '', price: i.price || 0 }));
    const order = await createOrder(customerId, items);
    res.json({ success: true, normalizedOrder: order, source: 'blinkit_webhook' });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

r.post('/zepto/webhook', async (req, res) => {
  try {
    const raw = req.body;
    const customerId = raw.user_id || raw.customer_id || 'cust_001';
    const items = (raw.cart_items || raw.items || []).map(i => ({ id: i.product_id || i.id, qty: i.count || i.qty || 1, name: i.product_name || i.name || '', price: i.selling_price || i.price || 0 }));
    const order = await createOrder(customerId, items);
    res.json({ success: true, normalizedOrder: order, source: 'zepto_webhook' });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

// ── EVENT LOG ─────────────────────────────────────────────────────────────
r.get('/events', (req, res) => res.json(bus.getLog()));

module.exports = r;
