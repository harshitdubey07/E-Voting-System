const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const VoterMaster = require('./models/VoterMaster');
const Candidate = require('./models/Candidate');
const Election = require('./models/Election');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/evoting";

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await VoterMaster.deleteMany({});
        await Candidate.deleteMany({});
        await Election.deleteMany({});

        // Add valid Voter IDs
        const voters = [
            { voter_id: 'V123' },
            { voter_id: 'V456' },
            { voter_id: 'V789' },
            { voter_id: 'V000' }
        ];
        await VoterMaster.insertMany(voters);
        console.log("✅ Seeded VoterMaster");

        // Add Candidates
        const candidates = [
            { name: 'John Smith' },
            { name: 'Sarah Johnson' },
            { name: 'Michael Brown' }
        ];
        await Candidate.insertMany(candidates);
        console.log("✅ Seeded Candidates");

        // Initialize Election status
        const election = new Election({ is_active: true });
        await election.save();
        console.log("✅ Election Started");

        console.log("\n✨ Seeding Complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
