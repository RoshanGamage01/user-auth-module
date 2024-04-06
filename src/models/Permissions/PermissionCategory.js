const mongoose = require('mongoose');

const PermissionCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

module.exports = mongoose.model('PermissionCategory', PermissionCategorySchema);