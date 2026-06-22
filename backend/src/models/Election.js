const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true,
        default: ""
    },

    status: {
        type: String,
        enum: ["upcoming", "active", "closed"],
        default: "upcoming"
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Election", electionSchema);