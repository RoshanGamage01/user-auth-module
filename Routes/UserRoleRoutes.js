const express = require('express');
const router = express.Router();
const UserRoleController = require('../App/controllers/RoleController');

router.post('/', UserRoleController.createUserRole);
router.post('/update', UserRoleController.updateUserRole);
router.post('/getAll', UserRoleController.getAllUserRoles);
// router.delete('/:id', UserRoleController.deleteUserRole);
router.get('/:id', UserRoleController.getUserRole);

module.exports = router;