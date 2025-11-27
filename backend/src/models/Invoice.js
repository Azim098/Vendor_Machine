const mongoose = require('mongoose');


const InvoiceSchema = new mongoose.Schema({
invoiceNumber: String,
vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
linkedPo: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
invoiceDate: Date,
dueDate: Date,
status: { type: String, enum: ['Pending','Paid','Overdue'], default: 'Pending' },
items: [{
description: String,
qty: Number,
unitPrice: Number,
taxRate: Number,
lineTotal: Number
}],
subtotal: Number,
taxTotal: Number,
total: Number,
pdfUrl: String,
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


module.exports = mongoose.model('Invoice', InvoiceSchema);