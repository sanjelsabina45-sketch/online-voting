const User = require("../models/User");

class UserService {

    async getAll() {
        return await User.find();
    }

    async getById(id) {
        return await User.findById(id);
    }

    async create(data) {
        return await User.create(data);
    }

    async update(id, data) {
        return await User.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = new UserService();