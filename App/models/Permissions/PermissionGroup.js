const mongoose = require('mongoose');

const PermissionGroupSchema = new mongoose.Schema({
    group: {
        type: String,
        required: true,
        unique: true
    },
    permission_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PermissionCategory',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

module.exports = mongoose.model('PermissionGroup', PermissionGroupSchema);