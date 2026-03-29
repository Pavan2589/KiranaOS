// models/index.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: String, name: String, price: Number, unit: String,
  category: String, emoji: String, stock: { type: Number, default: 100 }
}, { _id: false });

const StoreSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  ownerPhone: String, ownerName: String, ownerPassword: String,
  address: String, lat: Number, lng: Number,
  storeType: { type: String, enum: ['kirana', 'darkStore'], default: 'kirana' },
  serviceRadiusKm: { type: Number, default: 3 },
  isOnline: { type: Boolean, default: true },
  activeOrders: { type: Number, default: 0 },
  verification: {
    type: { type: String, enum: ['GSTIN', 'UDYAM', 'PAN'] },
    id: String,
    isVerified: { type: Boolean, default: false }
  },
  products: [ProductSchema],
  subscriptionTier: { type: String, enum: ['free', 'basic', 'pro'], default: 'free' },
  registeredAt: { type: Date, default: Date.now }
});

const CustomerSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String, phone: String, password: String,
  address: String, lat: Number, lng: Number,
  linkedPlatforms: {
    blinkit: { type: Boolean, default: false },
    zepto: { type: Boolean, default: false },
    swiggy: { type: Boolean, default: false }
  },
  subscriptionPlan: { type: String, enum: ['free', 'plus'], default: 'free' },
  registeredAt: { type: Date, default: Date.now }
});

const RiderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String, phone: String, password: String,
  vehicleType: { type: String, default: 'bike' },
  currentLat: Number, currentLng: Number,
  isOnline: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  activeOrderId: { type: String, default: null },
  earnings: [{
    orderId: String, amount: Number,
    bonus: { type: Number, default: 0 },
    isKiranaFirst: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  }],
  registeredAt: { type: Date, default: Date.now }
});

const OrderItemSchema = new mongoose.Schema({
  id: String, qty: Number, name: String, price: Number, emoji: String,
  fulfilledBy: { type: String, enum: ['kirana', 'darkStore'], default: 'kirana' }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  customerId: String,
  customerSnapshot: { name: String, phone: String, lat: Number, lng: Number, address: String },
  items: [OrderItemSchema],
  status: {
    type: String,
    enum: ['CREATED', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'REJECTED', 'DELIVERED'],
    default: 'CREATED'
  },
  assignedStoreId: { type: String, default: null },
  assignedStoreName: { type: String, default: null },
  assignedStoreType: { type: String, enum: ['kirana', 'darkStore'], default: 'kirana' },
  assignedRiderId: { type: String, default: null },
  darkStoreItems: [OrderItemSchema],
  darkStoreId: { type: String, default: null },
  distanceMeters: Number, etaMinutes: Number,
  rejectedStores: [String],
  totalAmount: Number,
  darkStoreDistanceMeters: Number,
  metersSaved: Number, minutesSaved: Number,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const SubscriptionSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  entityId: String,
  entityType: { type: String, enum: ['owner', 'customer'] },
  plan: { type: String, enum: ['basic', 'pro', 'plus'] },
  amount: Number,
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: Date
});

const Store = mongoose.model('Store', StoreSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Rider = mongoose.model('Rider', RiderSchema);
const Order = mongoose.model('Order', OrderSchema);
const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = { Store, Customer, Rider, Order, Subscription };
