const express = require('express');
const PurchaseOrder = require('../models/PurchaseOrder');
const auth = require('../middleware/auth');
const router = express.Router();

const generatePoNumber = () => `PO-${Date.now()}`;

router.post('/', auth, async (req, res) => {
  const poData = req.body;
  poData.poNumber = generatePoNumber();
  poData.createdBy = req.user._id;
  // basic totals calc
  let subtotal = 0, taxTotal = 0;
  poData.items = (poData.items || []).map(line => {
    line.lineTotal = (line.qty || 0) * (line.unitPrice || 0);
    subtotal += line.lineTotal;
    taxTotal += (line.taxRate || 0) * line.lineTotal / 100;
    return line;
  });
  poData.subtotal = subtotal;
  poData.taxTotal = taxTotal;
  poData.total = subtotal + taxTotal;
  const po = await PurchaseOrder.create(poData);
  res.status(201).json(po);
});

router.get('/', auth, async (req, res) => {
  const pos = await PurchaseOrder.find().populate('vendor').sort({ createdAt: -1 });
  res.json(pos);
});

router.get('/:id', auth, async (req, res) => {
  const po = await PurchaseOrder.findById(req.params.id).populate('vendor items.item');
  if(!po) return res.status(404).json({error:'Not found'});
  res.json(po);
});

router.put('/:id', auth, async (req, res) => {
  const updated = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
  await PurchaseOrder.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
