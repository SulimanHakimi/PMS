const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
    medicineId: String,
    name: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    instructions: String, // way to use
});

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: String,
    doctorName: {
        type: String,
        required: true
    },
    items: [InvoiceItemSchema],
    subTotal: Number,
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
