require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth');
const vendorRoutes = require('./src/routes/vendors');
const itemRoutes = require('./src/routes/items');
const poRoutes = require('./src/routes/purchaseOrders');
const invoiceRoutes = require('./src/routes/invoices');
const paymentRoutes = require('./src/routes/payments');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/purchase-orders', poRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
