const mongoose = require('mongoose');


const PaymentSchema = new mongoose.Schema({
invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
amount: Number,
paymentDate: Date,
method: String,
reference: String,
note: String
}, { timestamps: true });


module.exports = mongoose.model('Payment', PaymentSchema);