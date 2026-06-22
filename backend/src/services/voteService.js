const mongoose = require("mongoose");
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const Election = require("../models/Election");

class VoteService {

    async castVote({ userId, electionId, candidateId }) {
        const election = await Election.findById(electionId);
        if (!election) {
            throw new Error("Election not found");
        }
        if (election.status !== "active") {
            throw new Error("This election is not currently open for voting");
        }

        const candidate = await Candidate.findById(candidateId);
        if (!candidate || String(candidate.electionId) !== String(electionId)) {
            throw new Error("Candidate does not belong to this election");
        }

        try {
            return await Vote.create({ userId, electionId, candidateId });
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("You have already voted in this election");
            }
            throw error;
        }
    }

    async getResults(electionId) {
        const objectId = new mongoose.Types.ObjectId(electionId);

        const tally = await Vote.aggregate([
            { $match: { electionId: objectId } },
            {
                $group: {
                    _id: "$candidateId",
                    voteCount: { $sum: 1 }
                }
            }
        ]);

        const countByCandidate = {};
        tally.forEach((row) => {
            countByCandidate[String(row._id)] = row.voteCount;
        });

        const candidates = await Candidate.find({ electionId: objectId });

        const results = candidates.map((candidate) => ({
            candidateId: candidate._id,
            name: candidate.name,
            party: candidate.party,
            color: candidate.color,
            votes: countByCandidate[String(candidate._id)] || 0
        }));

        results.sort((a, b) => b.votes - a.votes);

        const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

        return { electionId, totalVotes, results };
    }

    async hasVoted(userId, electionId) {
        const vote = await Vote.findOne({ userId, electionId });
        return !!vote;
    }

    async getVotedElectionIds(userId) {
        const votes = await Vote.find({ userId }).select("electionId");
        return votes.map((v) => String(v.electionId));
    }
}

module.exports = new VoteService();