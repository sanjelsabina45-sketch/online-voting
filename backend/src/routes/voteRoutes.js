const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");

router.post("/", voteController.castVote);
router.get("/results/:electionId", voteController.getResults);
router.get("/status/:userId/:electionId", voteController.hasVoted);
router.get("/voted/:userId", voteController.getVotedElections);

module.exports = router;