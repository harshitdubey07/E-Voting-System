const User = require("../models/User");
const VoterMaster = require("../models/VoterMaster");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_me_in_production";

// ✅ Register
exports.register = async (req, res) => {
  try {
    const { voter_id, name, password } = req.body;

    // 🔥 FEAT: AUTO-REGISTRATION for Demo
    // If Voter ID starts with 'V' and isn't in Master list, we auto-add it for the demo
    if (voter_id.startsWith('V')) {
        let master = await VoterMaster.findOne({ voter_id });
        if (!master) {
            master = new VoterMaster({ voter_id });
            await master.save();
        }
    }

    const voterMaster = await VoterMaster.findOne({ voter_id });
    if (!voterMaster) {
      return res.send("Invalid Voter ID ❌");
    }

    const existingUser = await User.findOne({ voter_id });
    if (existingUser) {
      return res.send("User already registered ❌");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ voter_id, name, password: hashedPassword });
    await newUser.save();

    res.send("Successfully Registered ✅");
  } catch (err) {
    console.error(err);
    res.send("Server Error ❌");
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    const { voter_id, password } = req.body;

    const user = await User.findOne({ voter_id });
    if (!user) {
      return res.status(404).json({ message: "Voter not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password ❌" });
    }

    const token = jwt.sign(
      { id: user._id, voter_id: user.voter_id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, voter_id: user.voter_id });
  } catch (err) {
    res.status(500).json({ message: "Login error ❌" });
  }
};