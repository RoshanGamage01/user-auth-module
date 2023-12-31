const mongoose = require('mongoose');

const RolePermissionAssignSchema = new mongoose.Schema({
    user_role_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserRole'
    },
    permission_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PermissionCheckBoxes'
    }],
}, {timestamps: true});

module.exports = mongoose.model('RolePermissionAssign', RolePermissionAssignSchema);