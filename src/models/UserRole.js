const mongoose = require('mongoose');
const { paginate, toJSON } = require('./plugins');

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

UserRoleSchema.plugin(toJSON);
UserRoleSchema.plugin(paginate);



module.exports = mongoose.model('UserRole', UserRoleSchema);