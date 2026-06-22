const candidateService = require("../services/candidateService");

exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await candidateService.getAll();
        res.status(200).json(candidates);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCandidatesByElection = async (req, res) => {
    try {
        const candidates = await candidateService.getByElection(req.params.electionId);
        res.status(200).json(candidates);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await candidateService.getById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json(candidate);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCandidate = async (req, res) => {
    try {
        const candidate = await candidateService.create(req.body);
        res.status(201).json(candidate);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCandidate = async (req, res) => {
    try {
        const candidate = await candidateService.update(req.params.id, req.body);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json(candidate);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCandidate = async (req, res) => {
    try {
        await candidateService.delete(req.params.id);
        res.status(200).json({ message: "Candidate deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};