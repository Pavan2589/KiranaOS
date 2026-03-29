// seed.js — run with: node seed/seed.js
// This WIPES and re-inserts all data so password fields are populated correctly.
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { Store, Customer, Rider, Order } = require('../models');
const { STORES, CUSTOMERS, RIDERS } = require('./data');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await Promise.all([Store.deleteMany(), Customer.deleteMany(), Rider.deleteMany(), Order.deleteMany()]);
  await Store.insertMany(STORES);
  await Customer.insertMany(CUSTOMERS);
  await Rider.insertMany(RIDERS);
  console.log(`\n✅ Seeded successfully:`);
  console.log(`   ${STORES.length} stores, ${CUSTOMERS.length} customers, ${RIDERS.length} riders`);
  console.log(`\n🔑 Demo credentials (all roles):`);
  console.log(`   Customer  →  +919876543210  /  demo123`);
  console.log(`   Owner     →  +919876543210  /  demo123`);
  console.log(`   Rider     →  +919876543210  /  demo123`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
