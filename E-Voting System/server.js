require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db"); // MongoDB Connection

// Routes
const authRoutes = require("./routes/authRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// 🏛️ Serve static files from the new 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use("/api", authRoutes);
app.use("/api", voteRoutes);

// 🌐 Default Route: Serve the National Landing Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});