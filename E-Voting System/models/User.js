const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    voter_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    has_voted: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
