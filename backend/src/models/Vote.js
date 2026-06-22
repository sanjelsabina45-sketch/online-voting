const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true
    },

    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true
    }
},
{
    timestamps: true
});

// A user can only vote once per election — enforced by MongoDB itself,
// not just application logic.
voteSchema.index({ userId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);