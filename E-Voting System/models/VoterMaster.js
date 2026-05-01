const mongoose = require('mongoose');

const VoterMasterSchema = new mongoose.Schema({
    voter_id: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('VoterMaster', VoterMasterSchema);
