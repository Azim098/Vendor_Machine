const jwt = require('jsonwebtoken');
const User = require('../models/User');


const auth = async (req, res, next) => {
const authHeader = req.header('Authorization') || '';
const token = authHeader.replace('Bearer ', '');
if (!token) return res.status(401).json({ error: 'No token' });
try {
const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
req.user = await User.findById(payload.id).select('-passwordHash');
next();
} catch (err) {
res.status(401).json({ error: 'Invalid token' });
}
};


module.exports = auth;