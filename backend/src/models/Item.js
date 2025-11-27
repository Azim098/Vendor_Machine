const mongoose = require('mongoose');


const ItemSchema = new mongoose.Schema({
code: String,
name: { type: String, required: true },
description: String,
unitPrice: { type: Number, default: 0 },
unit: String,
taxRate: { type: Number, default: 0 }
}, { timestamps: true });


module.exports = mongoose.model('Item', ItemSchema);