const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const voteController = require("../controllers/voteController");

router.get("/candidates", voteController.getCandidates);
router.post("/vote", authMiddleware, voteController.vote);
router.get("/results", voteController.getResults);
router.get("/winner", voteController.getWinner);
router.get("/status", voteController.getElectionStatus);
router.get("/current-vote", authMiddleware, voteController.getCurrentVote);

// Admin Routes
router.post("/add-candidate", authMiddleware, voteController.addCandidate);
router.post("/remove-candidate", authMiddleware, voteController.removeCandidate);
router.post("/start-election", authMiddleware, voteController.startElection);
router.post("/stop-election", authMiddleware, voteController.stopElection);

module.exports = router;