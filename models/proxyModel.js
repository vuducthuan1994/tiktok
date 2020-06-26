'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProxySchema = new Schema({
    protocol: {
        type: String,
        required: true,
        trim: true
    },
    ip: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    user: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    port: {
        type: Number,
        required: true,
        trim: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date,
        default: Date.now
    },
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});

let Proxys = mongoose.model('Proxys', ProxySchema);
module.exports = Proxys;