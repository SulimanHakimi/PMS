const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this medicine.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    medicineId: {
        type: String,
        required: [true, 'Please specify the medicine ID.'],
        unique: true,
    },
    group: {
        type: String,
        required: [true, 'Please specify the group.'],
    },
    stock: {
        type: Number,
        required: [true, 'Please specify the stock quantity.'],
        min: [0, 'Stock cannot be negative'],
    },
    supplier: {
        type: String,
        required: [true, 'Please specify the supplier.'],
    },
    buyPrice: {
        type: Number,
        required: [true, 'Please specify the buy price.'],
        min: [0, 'Buy price cannot be negative'],
    },
    sellPrice: {
        type: Number,
        required: [true, 'Please specify the sell price.'],
        min: [0, 'Sell price cannot be negative'],
    },
    description: {
        type: String,
    },
}, { timestamps: true });

// Force refresh model to avoid stale schema
if (mongoose.models.Medicine) {
    delete mongoose.models.Medicine;
}

module.exports = mongoose.model('Medicine', MedicineSchema);
