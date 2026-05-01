const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");
const Election = require("../models/Election");

// ✅ Get candidates
exports.getCandidates = async (req, res) => {
  try {
    const result = await Candidate.find();
    res.json(result);
  } catch (err) {
    res.send("Error ❌");
  }
};

// ✅ Get Election Status & Timer info
exports.getElectionStatus = async (req, res) => {
    try {
        const election = await Election.findOne();
        if (!election) {
            return res.json({ is_active: false, end_time: null });
        }
        res.json({
            is_active: election.is_active,
            end_time: election.end_time,
            server_now: new Date()
        });
    } catch (err) {
        res.status(500).send("Error");
    }
};

// ✅ Vote (Supports Timer Check & Editing)
exports.vote = async (req, res) => {
  try {
    const { voter_id, candidate_id } = req.body;

    const election = await Election.findOne();
    const now = new Date();

    if (!election || !election.is_active) {
        return res.send("Election is not active ❌");
    }

    if (election.end_time && now > election.end_time) {
        return res.send("Election has expired ❌");
    }

    const user = await User.findOne({ voter_id });
    if (!user) {
      return res.send("User not found ❌");
    }

    const existingVote = await Vote.findOne({ user_id: user._id });

    if (existingVote) {
        existingVote.candidate_id = candidate_id;
        await existingVote.save();
        return res.send("Vote updated successfully ✅");
    } else {
        const newVote = new Vote({
            user_id: user._id,
            candidate_id: candidate_id
        });
        await newVote.save();
        user.has_voted = true;
        await user.save();
        return res.send("Vote cast successfully ✅");
    }

  } catch (err) {
    console.error(err);
    res.send("Vote error ❌");
  }
};

// ✅ Results
exports.getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const results = await Promise.all(candidates.map(async (c) => {
        const count = await Vote.countDocuments({ candidate_id: c._id });
        return { name: c.name, total_votes: count };
    }));
    res.json(results);
  } catch (err) {
    res.send("Error ❌");
  }
};

// ✅ Winner (Now with TIE detection)
exports.getWinner = async (req, res) => {
    try {
      const candidates = await Candidate.find();
      let maxVotes = 0;
      let leadingCandidates = [];
      
      for (const c of candidates) {
          const count = await Vote.countDocuments({ candidate_id: c._id });
          if (count > maxVotes) {
              maxVotes = count;
              leadingCandidates = [c.name];
          } else if (count === maxVotes && maxVotes > 0) {
              leadingCandidates.push(c.name);
          }
      }

      if (leadingCandidates.length > 1) {
          res.json({ name: leadingCandidates.join(" & "), total_votes: maxVotes, is_tie: true });
      } else if (leadingCandidates.length === 1) {
          res.json({ name: leadingCandidates[0], total_votes: maxVotes, is_tie: false });
      } else {
          res.json({ name: "No winner", total_votes: 0, is_tie: false });
      }
    } catch (err) {
      res.send("Error ❌");
    }
};

// ✅ Get Current User's Vote
exports.getCurrentVote = async (req, res) => {
    try {
        const voter_id = req.user.voter_id;
        const user = await User.findOne({ voter_id });
        if (!user) return res.json({ candidate: null });

        const vote = await Vote.findOne({ user_id: user._id }).populate('candidate_id');
        if (vote) {
            res.json({ candidate: vote.candidate_id });
        } else {
            res.json({ candidate: null });
        }
    } catch (err) {
        res.status(500).send("Error ❌");
    }
};

// ================= ADMIN FUNCTIONS =================

exports.addCandidate = async (req, res) => {
    try {
        const { name } = req.body;
        const newCandidate = new Candidate({ name });
        await newCandidate.save();
        res.send("Candidate Added Successfully ✅");
    } catch (err) {
        res.send("Error ❌");
    }
};

exports.removeCandidate = async (req, res) => {
    try {
        const { id } = req.body;
        await Candidate.findByIdAndDelete(id);
        res.send("Candidate Removed Successfully ✅");
    } catch (err) {
        res.send("Error ❌");
    }
};

exports.startElection = async (req, res) => {
    try {
        const { duration } = req.body;
        const endTime = new Date(Date.now() + duration * 60000);

        let election = await Election.findOne();
        if (!election) {
            election = new Election({ 
                is_active: true,
                end_time: endTime
            });
        } else {
            election.is_active = true;
            election.end_time = endTime;
        }
        await election.save();
        res.send(`Election Started! Closing at ${endTime.toLocaleTimeString()} ✅`);
    } catch (err) {
        res.send("Error ❌");
    }
};

exports.stopElection = async (req, res) => {
    try {
        let election = await Election.findOne();
        if (election) {
            election.is_active = false;
            election.end_time = null;
            await election.save();
        }
        res.send("Election Stopped ✅");
    } catch (err) {
        res.send("Error ❌");
    }
};