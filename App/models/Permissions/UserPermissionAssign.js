const mongoose = require('mongoose');

const UserPermissionAssignSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permission_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        default: []
    }]
}, {timestamps: true});

module.exports = mongoose.model('UserPermissionAssign', UserPermissionAssignSchema);