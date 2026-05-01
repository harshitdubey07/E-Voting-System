const jwt = require("jsonwebtoken");
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.send("Access Denied ❌");
  }

  // 🔥 Allow Admin Bypass for the demonstration
  if (token === "admin-bypass") {
      req.user = { voter_id: "admin", role: "admin" };
      return next();
  }

  try {
    const secret = process.env.JWT_SECRET || "secretkey";
    const verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (err) {
    res.send("Invalid Token ❌");
  }
};