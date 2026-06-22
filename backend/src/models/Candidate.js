const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
{
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    party: {
        type: String,
        trim: true,
        default: ""
    },

    info: {
        type: String,
        trim: true,
        default: ""
    },

    color: {
        type: String,
        trim: true,
        default: "#667eea"
    },

    agenda: {
        type: [String],
        default: []
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Candidate", candidateSchema);