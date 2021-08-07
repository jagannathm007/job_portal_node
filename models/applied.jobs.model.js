let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    jobId: {
        type: mongoose.Types.ObjectId,
        ref: 'jobs',
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    attachment: {
        type: String,
        default: ""
    },
    comments: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        trim: true,
        enum: ['active', 'deactive'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('appliedjobs', schema);