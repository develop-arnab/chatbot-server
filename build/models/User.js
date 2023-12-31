"use strict";
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshtoken: { type: String, required: false }
}, { collection: 'users' });
module.exports = mongoose.model('UserSchema', UserSchema);
