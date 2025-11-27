const mongoose = require('mongoose');


const LineSchema = new mongoose.Schema({
item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false },
description: String,
qty: { type: Number, default: 1 },
unitPrice: { type: Number, default: 0 },
taxRate: { type: Number, default: 0 },
lineTotal: { type: Number, default: 0 }
}, {_id:false});


const POSchema = new mongoose.Schema({
poNumber: { type: String, unique: true },
vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
status: { type: String, enum: ['Draft','Sent','Partially Received','Completed','Cancelled'], default: 'Draft' },
items: [LineSchema],
subtotal: Number,
taxTotal: Number,
total: Number,
pdfUrl: String,
notes: String
}, { timestamps: true });


module.exports = mongoose.model('PurchaseOrder', POSchema);