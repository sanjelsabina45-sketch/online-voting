const electionService = require("../services/electionService");

exports.getAllElections = async (req, res) => {
    try {
        const elections = await electionService.getAll();
        res.status(200).json(elections);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getElectionById = async (req, res) => {
    try {
        const election = await electionService.getById(req.params.id);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }
        res.status(200).json(election);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createElection = async (req, res) => {
    try {
        const election = await electionService.create(req.body);
        res.status(201).json(election);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateElection = async (req, res) => {
    try {
        const election = await electionService.update(req.params.id, req.body);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }
        res.status(200).json(election);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteElection = async (req, res) => {
    try {
        await electionService.delete(req.params.id);
        res.status(200).json({ message: "Election deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};