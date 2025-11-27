const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const router = express.Router();


router.post('/register', async (req, res) => {
const { name, email, password, role } = req.body;
const hash = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, passwordHash: hash, role });
res.json({ id: user._id, email: user.email });
});


router.post('/login', async (req, res) => {
const { email, password } = req.body;
const u = await User.findOne({ email });
if (!u) return res.status(401).json({ error: 'Invalid creds' });
const ok = await bcrypt.compare(password, u.passwordHash);
if (!ok) return res.status(401).json({ error: 'Invalid creds' });
const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '12h' });
res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
});


module.exports = router;