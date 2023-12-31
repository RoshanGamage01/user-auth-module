const express = require('express');
const router = express.Router();
const AuthController = require('../App/controllers/AuthControllers');
const auth = require('../App/middlewares/Auth');

// router.get('/:id', AuthController.getUserById);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', auth, AuthController.logout);
router.post('/getAll', AuthController.getAllUsers);
router.post('/export-csv', () => {});
router.get('/me', auth, AuthController.getMe);
router.post('/mobile-login', AuthController.mobileLogin);
router.get('/validate', () => {});

module.exports = router;