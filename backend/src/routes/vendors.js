const express = require('express');
const Vendor = require('../models/Vendor');
const auth = require('../middleware/auth');


const router = express.Router();


router.get('/', auth, async (req, res) => {
const vendors = await Vendor.find();
res.json(vendors);
});


router.post('/', auth, async (req, res) => {
const v = await Vendor.create(req.body);
res.status(201).json(v);
});


router.get('/:id', auth, async (req, res) => {
const v = await Vendor.findById(req.params.id);
if (!v) return res.status(404).json({ error: 'Not found' });
res.json(v);
});


router.put('/:id', auth, async (req, res) => {
const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(v);
});


module.exports = router;