import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a group name.'],
        unique: true,
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    description: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
