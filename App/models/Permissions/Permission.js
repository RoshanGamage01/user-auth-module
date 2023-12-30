const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    permission: {
        type: String,
        required: true,
        unique: true
    },
    permission_group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PermissionGroup',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Permission', PermissionSchema);