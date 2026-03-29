// server.js — KiranaOS v3
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bus = require('./services/eventBus');
const { Store, Customer, Rider, Order } = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/auth'));

// ── MongoDB ────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('[DB] MongoDB connected ✓');
    await autoSeed();
  })
  .catch(err => console.error('[DB] MongoDB error:', err.message));

async function autoSeed() {
  const count = await Store.countDocuments();
  if (count === 0) {
    const { STORES, CUSTOMERS, RIDERS } = require('./seed/data');
    await Store.insertMany(STORES);
    await Customer.insertMany(CUSTOMERS);
    await Rider.insertMany(RIDERS);
    console.log('[Seed] Auto-seeded ✓ (phone: +919876543210 / pass: demo123)');
  } else {
    const sample = await Customer.findOne();
    if (!sample?.password) {
      const { STORES, CUSTOMERS, RIDERS } = require('./seed/data');
      await Promise.all([Store.deleteMany(), Customer.deleteMany(), Rider.deleteMany(), Order.deleteMany()]);
      await Store.insertMany(STORES);
      await Customer.insertMany(CUSTOMERS);
      await Rider.insertMany(RIDERS);
      console.log('[Seed] Re-seeded with passwords ✓');
    }
  }
}

// ── Product management ─────────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage() });

function parseCSV(content) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  return lines.slice(1).map((line, i) => {
    const vals = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
    const row = {};
    headers.forEach((h, idx) => { row[h] = vals[idx] || ''; });
    return row;
  });
}

app.post('/api/store/:storeId/product', async (req, res) => {
  try {
    const { name, price, unit, category, emoji, stock } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'name and price required' });
    const id = `item_${Date.now()}_${Math.random().toString(36).slice(2,5)}`;
    const product = { id, name, price: Number(price), unit: unit||'', category: category||'other', emoji: emoji||'📦', stock: Number(stock)||100 };
    await Store.findOneAndUpdate({ id: req.params.storeId }, { $push: { products: product } });
    res.json({ success: true, product });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

app.put('/api/store/:storeId/product/:productId', async (req, res) => {
  try {
    const { name, price, unit, category, emoji, stock } = req.body;
    await Store.findOneAndUpdate(
      { id: req.params.storeId, 'products.id': req.params.productId },
      { $set: { 'products.$': { id: req.params.productId, name, price: Number(price), unit: unit||'', category: category||'other', emoji: emoji||'📦', stock: Number(stock)||100 } } }
    );
    res.json({ success: true });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/store/:storeId/product/:productId', async (req, res) => {
  try {
    await Store.findOneAndUpdate({ id: req.params.storeId }, { $pull: { products: { id: req.params.productId } } });
    res.json({ success: true });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/store/:storeId/products/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const content = req.file.buffer.toString('utf8');
    const records = parseCSV(content);
    const products = records.map((row, i) => ({
      id: `item_csv_${Date.now()}_${i}`,
      name: row.name || row.item || `Product ${i+1}`,
      price: Number(row.price || row.mrp || 0),
      unit: row.unit || '', category: row.category || 'other',
      emoji: row.emoji || '📦', stock: Number(row.stock || row.qty || 100)
    })).filter(p => p.name && p.price > 0);
    if (!products.length) return res.status(400).json({ error: 'No valid products. CSV must have name and price columns.' });
    await Store.findOneAndUpdate({ id: req.params.storeId }, { $push: { products: { $each: products } } });
    res.json({ success: true, count: products.length, products });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

app.get('/api/store/:storeId/products', async (req, res) => {
  const store = await Store.findOne({ id: req.params.storeId });
  if (!store) return res.status(404).json({ error: 'Store not found' });
  res.json(store.products);
});

// ── Subscriptions ──────────────────────────────────────────────────────────
const PLANS = {
  owner: { basic: { amount: 99, label: 'Basic' }, pro: { amount: 499, label: 'Pro' } },
  customer: { plus: { amount: 49, label: 'Plus' } }
};

app.get('/api/subscriptions/plans', (req, res) => res.json(PLANS));

app.post('/api/subscriptions', async (req, res) => {
  try {
    const { entityId, entityType, plan } = req.body;
    const { Subscription } = require('./models');
    const id = `sub_${Date.now()}`;
    const planInfo = PLANS[entityType]?.[plan];
    if (!planInfo) return res.status(400).json({ error: 'Invalid plan' });
    const endDate = new Date(); endDate.setMonth(endDate.getMonth() + 1);
    const sub = await Subscription.create({ id, entityId, entityType, plan, amount: planInfo.amount, endDate });
    if (entityType === 'owner') await Store.findOneAndUpdate({ id: entityId }, { subscriptionTier: plan });
    if (entityType === 'customer') await Customer.findOneAndUpdate({ id: entityId }, { subscriptionPlan: plan });
    res.json({ success: true, subscription: sub });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

app.get('/api/subscriptions/:entityId', async (req, res) => {
  const { Subscription } = require('./models');
  const subs = await Subscription.find({ entityId: req.params.entityId, status: 'active' });
  res.json(subs);
});

// Platform account linking
app.post('/api/customer/:id/link-platform', async (req, res) => {
  try {
    const { platform, linked } = req.body;
    if (!['blinkit', 'zepto', 'swiggy'].includes(platform)) return res.status(400).json({ error: 'Invalid platform' });
    await Customer.findOneAndUpdate({ id: req.params.id }, { [`linkedPlatforms.${platform}`]: linked });
    res.json({ success: true });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

// Store service radius update
app.put('/api/store/:storeId/settings', async (req, res) => {
  try {
    const { serviceRadiusKm } = req.body;
    await Store.findOneAndUpdate({ id: req.params.storeId }, { serviceRadiusKm: Number(serviceRadiusKm) });
    res.json({ success: true });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

// Rider location update (REST fallback)
app.post('/api/rider/:id/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    await Rider.findOneAndUpdate({ id: req.params.id }, { currentLat: lat, currentLng: lng });
    io.emit('rider:location', { riderId: req.params.id, lat, lng });
    res.json({ success: true });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

// Rider earnings
app.get('/api/rider/:id/earnings', async (req, res) => {
  const rider = await Rider.findOne({ id: req.params.id });
  if (!rider) return res.status(404).json({ error: 'Not found' });
  const total = rider.earnings.reduce((s, e) => s + e.amount, 0);
  const bonus = rider.earnings.reduce((s, e) => s + (e.bonus || 0), 0);
  res.json({ earnings: rider.earnings, total, bonus, count: rider.earnings.length });
});

// ── Socket.IO ──────────────────────────────────────────────────────────────
const WS_CHANNELS = [
  'order:new','order:accepted','order:rejected','order:delivered',
  'order:noStore','store:status','order:update','rider:assigned','rider:location'
];
WS_CHANNELS.forEach(ch => { bus.on(ch, payload => io.emit(ch, payload)); });

// Rider socket location streaming
io.on('connection', async (socket) => {
  try {
    const [stores, orders, customers, riders] = await Promise.all([
      Store.find(), Order.find().sort({ createdAt: -1 }).limit(50), Customer.find(), Rider.find()
    ]);
    socket.emit('init', { stores, orders, customers, riders });
  } catch(e) {}

  // Rider emits location via socket (preferred over REST)
  socket.on('rider:location', async ({ riderId, lat, lng }) => {
    try {
      await Rider.findOneAndUpdate({ id: riderId }, { currentLat: lat, currentLng: lng });
      // Broadcast to all (customer tracking + owner maps)
      socket.broadcast.emit('rider:location', { riderId, lat, lng });
    } catch(_) {}
  });

  // Customer subscribes to track a specific order
  socket.on('track:order', ({ orderId }) => {
    socket.join(`order:${orderId}`);
  });

  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => { console.log(`\n🏪 KiranaOS v3 API → http://localhost:${PORT}/api`); });
