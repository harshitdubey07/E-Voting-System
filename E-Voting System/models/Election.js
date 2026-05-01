const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
    is_active: { type: Boolean, default: false },
    end_time: { type: Date, default: null }
});

module.exports = mongoose.model('Election', ElectionSchema);
