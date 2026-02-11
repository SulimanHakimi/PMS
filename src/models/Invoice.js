import mongoose from 'mongoose';

const InvoiceItemSchema = new mongoose.Schema({
    medicineId: String,
    name: String,
    quantity: Number,
    unitPrice: Number,
    buyPrice: Number, // Cost price at time of sale
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
    createdBy: {
        type: String, // Username of the creator
        default: 'admin'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
