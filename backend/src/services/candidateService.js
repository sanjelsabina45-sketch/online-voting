const Candidate = require("../models/Candidate");

class CandidateService {

    async getAll() {
        return await Candidate.find().sort({ createdAt: -1 });
    }

    async getByElection(electionId) {
        return await Candidate.find({ electionId });
    }

    async getById(id) {
        return await Candidate.findById(id);
    }

    async create(data) {
        return await Candidate.create(data);
    }

    async update(id, data) {
        return await Candidate.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return await Candidate.findByIdAndDelete(id);
    }
}

module.exports = new CandidateService();