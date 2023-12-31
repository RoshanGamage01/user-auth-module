const mongoose = require('mongoose');

const UserRoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('UserRole', UserRoleSchema);