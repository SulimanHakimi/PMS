const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['visitor', 'admin'],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
});

const VisitorChatSchema = new mongoose.Schema({
    visitorName: {
        type: String,
        required: true
    },
    visitorId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    lastMessage: String,
    lastMessageTime: {
        type: Date,
        default: Date.now
    },
    unreadCount: {
        type: Number,
        default: 0
    },
    messages: [MessageSchema],
    device: String,
    location: String
}, { timestamps: true });

module.exports = mongoose.models.VisitorChat || mongoose.model('VisitorChat', VisitorChatSchema);
