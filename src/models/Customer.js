import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this customer.'],
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number.'],
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
