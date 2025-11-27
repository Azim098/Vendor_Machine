const express = require('express');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const data = req.body;
  data.paymentDate = data.paymentDate ? new Date(data.paymentDate) : new Date();
  const p = await Payment.create(data);
  // mark invoice paid if payment fully covers invoice (simplified)
  if (data.invoice) {
    const inv = await Invoice.findById(data.invoice);
    if (inv) {
      // simplistic: if payment amount >= invoice.total -> set paid
      if (data.amount >= inv.total) {
        inv.status = 'Paid';
        await inv.save();
      }
    }
  }
  res.status(201).json(p);
});

router.get('/', auth, async (req, res) => res.json(await Payment.find().populate('invoice vendor').sort({ createdAt: -1 })));

router.get('/:id', auth, async (req, res) => {
  const p = await Payment.findById(req.params.id).populate('invoice vendor');
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

module.exports = router;
