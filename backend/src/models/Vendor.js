const mongoose = require('mongoose');


const VendorSchema = new mongoose.Schema({
name: { type: String, required: true },
gstin: String,
contactPerson: String,
phone: String,
email: String,
address: String,
bankDetails: {
accountNumber: String,
ifsc: String,
bankName: String,
},
notes: String
}, { timestamps: true });


module.exports = mongoose.model('Vendor', VendorSchema);