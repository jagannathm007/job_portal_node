let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    position: {
        type: String,
        trim: true,
        required: true
    },
    tech: {
        type: String,
        trim: true,
        default: ""
    },
    experience: {
        type: Number,
        min: 0,
        required: true
    },
    vacancies: {
        type: Number,
        min: 1,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active'
    },
    postCreatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('jobs', schema);