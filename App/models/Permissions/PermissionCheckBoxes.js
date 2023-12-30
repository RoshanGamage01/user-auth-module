const mongoose = require('mongoose');

const PermissionCheckBoxesSchema = new mongoose.Schema({
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    },
    permission_name: {
        type: String,
        required: true
    },
    check_box_status: {
        type: Boolean,
        required: true,
        default: false
    },
    checkBoxType: { // 1 - CREATE | 2 - READ | 3 - UPDATE | 4 - DELETE
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('PermissionCheckBoxes', PermissionCheckBoxesSchema);