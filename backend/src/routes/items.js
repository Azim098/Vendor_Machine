const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => res.json(await Item.find()));
router.post('/', auth, async (req, res) => res.status(201).json(await Item.create(req.body)));
router.put('/:id', auth, async (req, res) => res.json(await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', auth, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
module.exports = router;
