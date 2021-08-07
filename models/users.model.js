let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 10,
        required: true
    },
    type: {
        type: String,
        trim: true,
        enum: ['hr', 'general'],
        required: true
    },
    status: {
        type: String,
        trim: true,
        enum: ['active', 'deactive'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('users', schema);