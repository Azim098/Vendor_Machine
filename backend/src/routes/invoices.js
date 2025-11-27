const express = require('express');
const Invoice = require('../models/Invoice');
const PurchaseOrder = require('../models/PurchaseOrder');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// create invoice and accept a single file 'file'
router.post('/', auth, upload.single('file'), async (req, res) => {
  const data = req.body;
  if (req.file) data.pdfUrl = `/uploads/${req.file.filename}`;
  // parse items if sent as JSON string
  if (typeof data.items === 'string') {
    try { data.items = JSON.parse(data.items); } catch(e) { data.items = []; }
  }
  // compute totals
  let subtotal = 0, taxTotal = 0;
  (data.items || []).forEach(it => {
    it.lineTotal = (it.qty||0) * (it.unitPrice||0);
    subtotal += it.lineTotal;
    taxTotal += (it.taxRate||0) * it.lineTotal / 100;
  });
  data.subtotal = subtotal;
  data.taxTotal = taxTotal;
  data.total = subtotal + taxTotal;
  data.createdBy = req.user._id;
  const invoice = await Invoice.create(data);

  // if linked to PO, optionally update PO status
  if (data.linkedPo) {
    await PurchaseOrder.findByIdAndUpdate(data.linkedPo, { $set: { status: 'Partially Received' } });
  }

  res.status(201).json(invoice);
});

router.get('/', auth, async (req, res) => {
  const invoices = await Invoice.find().populate('vendor linkedPo').sort({ createdAt: -1 });
  res.json(invoices);
});

router.get('/:id', auth, async (req, res) => {
  const inv = await Invoice.findById(req.params.id).populate('vendor linkedPo');
  if(!inv) return res.status(404).json({ error: 'Not found' });
  res.json(inv);
});

router.put('/:id', auth, async (req, res) => {
  const inv = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(inv);
});

router.delete('/:id', auth, async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
