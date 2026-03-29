// routes/auth.js
const express = require('express');
const r = express.Router();
const { Store, Customer, Rider } = require('../models');

// Helper to generate simple IDs
function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── CUSTOMER AUTH ──────────────────────────────────────────────────────────
r.post('/customer/register', async (req, res) => {
  try {
    const { name, phone, password, lat, lng } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ error: 'name, phone, password required' });

    const existing = await Customer.findOne({ phone });
    if (existing) return res.status(400).json({ error: 'Phone already registered' });

    const customer = await Customer.create({
      id: makeId('cust'),
      name, phone, password,
      lat: lat || 19.1355, lng: lng || 72.8290,
      address: req.body.address || ''
    });

    const userData = { role: 'customer', id: customer.id, name: customer.name, phone: customer.phone };
    res.json({ success: true, user: userData });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

r.post('/customer/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const customer = await Customer.findOne({ phone, password });
    if (!customer) return res.status(401).json({ error: 'Invalid phone or password' });

    const userData = { role: 'customer', id: customer.id, name: customer.name, phone: customer.phone };
    res.json({ success: true, user: userData });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// ── OWNER AUTH ──────────────────────────────────────────────────────────────
r.post('/owner/register', async (req, res) => {
  try {
    const { name, phone, password, storeName, address, verType, verId, lat, lng } = req.body;
    if (!name || !phone || !password || !storeName) return res.status(400).json({ error: 'All fields required' });

    const existing = await Store.findOne({ ownerPhone: phone });
    if (existing) return res.status(400).json({ error: 'Phone already registered' });

    const storeId = makeId('store');
    const store = await Store.create({
      id: storeId,
      name: storeName,
      ownerPhone: phone,
      ownerName: name,
      ownerPassword: password,
      address: address || '',
      lat: lat || 19.1360,
      lng: lng || 72.8296,
      isOnline: true,
      activeOrders: 0,
      verification: {
        type: verType || 'GSTIN',
        id: verId || '',
        isVerified: false
      },
      products: []
    });

    const userData = { role: 'owner', id: store.id, name, phone, storeName: store.name, storeId: store.id };
    res.json({ success: true, user: userData });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

r.post('/owner/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const store = await Store.findOne({ ownerPhone: phone, ownerPassword: password });
    if (!store) return res.status(401).json({ error: 'Invalid phone or password' });

    const userData = { role: 'owner', id: store.id, name: store.ownerName || 'Owner', phone, storeName: store.name, storeId: store.id };
    res.json({ success: true, user: userData });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// ── RIDER AUTH ──────────────────────────────────────────────────────────────
r.post('/rider/register', async (req, res) => {
  try {
    const { name, phone, password, vehicleType, lat, lng } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ error: 'All fields required' });

    const existing = await Rider.findOne({ phone });
    if (existing) return res.status(400).json({ error: 'Phone already registered' });

    const rider = await Rider.create({
      id: makeId('rider'),
      name, phone, password,
      vehicleType: vehicleType || 'bike',
      // Start with null — location will be broadcast live once they go online
      currentLat: lat || null,
      currentLng: lng || null,
      isOnline: false, isAvailable: true
    });

    const userData = { role: 'rider', id: rider.id, name: rider.name, phone: rider.phone };
    res.json({ success: true, user: userData });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

r.post('/rider/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const rider = await Rider.findOne({ phone, password });
    if (!rider) return res.status(401).json({ error: 'Invalid phone or password' });

    const userData = { role: 'rider', id: rider.id, name: rider.name, phone: rider.phone };
    res.json({ success: true, user: userData });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = r;
