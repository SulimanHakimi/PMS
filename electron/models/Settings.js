const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    pharmacyName: {
        type: String,
        default: 'Sheen Pharma'
    },
    address: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        default: 'AFN'
    },
    taxRate: {
        type: Number,
        default: 0
    },
    receiptFooter: {
        type: String,
        default: 'Thanks for your visit!'
    }
}, { timestamps: true });

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

module.exports = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
