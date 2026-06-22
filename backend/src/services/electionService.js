const Election = require("../models/Election");

class ElectionService {

    async getAll() {
        return await Election.find().sort({ createdAt: -1 });
    }

    async getById(id) {
        return await Election.findById(id);
    }

    async create(data) {
        return await Election.create(data);
    }

    async update(id, data) {
        return await Election.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return await Election.findByIdAndDelete(id);
    }
}

module.exports = new ElectionService();