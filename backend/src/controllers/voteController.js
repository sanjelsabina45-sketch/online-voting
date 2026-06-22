const voteService = require("../services/voteService");

exports.castVote = async (req, res) => {
    try {
        const { userId, electionId, candidateId } = req.body;

        if (!userId || !electionId || !candidateId) {
            return res.status(400).json({
                message: "userId, electionId, and candidateId are required"
            });
        }

        const vote = await voteService.castVote({ userId, electionId, candidateId });

        res.status(201).json({ message: "Vote recorded successfully", vote });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const results = await voteService.getResults(req.params.electionId);
        res.status(200).json(results);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.hasVoted = async (req, res) => {
    try {
        const { userId, electionId } = req.params;
        const voted = await voteService.hasVoted(userId, electionId);
        res.status(200).json({ voted });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVotedElections = async (req, res) => {
    try {
        const electionIds = await voteService.getVotedElectionIds(req.params.userId);
        res.status(200).json({ electionIds });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};