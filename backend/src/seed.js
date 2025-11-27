// src/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Item = require('./models/Item');

(async () => {
  await connectDB();
  await User.deleteMany();
  await Vendor.deleteMany();
  await Item.deleteMany();

  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash: require('bcryptjs').hashSync('password', 10), role: 'admin' });
  const v1 = await Vendor.create({ name: 'Acme Supplies', gstin: '27ABCDE1234F1Z5', contactPerson: 'Karan', phone: '9999999999', email:'ven1@example.com', address: 'Dubai' });
  await Item.create({ code: 'ITM001', name: 'Paper A4', unitPrice: 5, unit: 'pc', taxRate: 5 });

  console.log('Seed completed. Admin credentials: admin@example.com / password');
  process.exit(0);
})();
