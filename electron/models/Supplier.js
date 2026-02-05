const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    contactPerson: String,
    phone: String,
    email: String,
    address: String,
    notes: String
}, { timestamps: true });

module.exports = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
