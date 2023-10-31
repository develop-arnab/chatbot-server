"use strict";
var mongoose = require('mongoose');
var ChatbotSchema = new mongoose.Schema({
    owner_id: { type: String, required: false },
    apiKey: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: false },
    room: { type: String, required: false },
    company: { type: String, required: false },
    info: { type: String, required: false },
    gender: { type: String, required: false },
    role: { type: String, required: false },
    status: { type: String, required: false },
    filename: { type: String, required: false }
}, { collection: 'chatbot' });
module.exports = mongoose.model('ChatbotSchema', ChatbotSchema);
