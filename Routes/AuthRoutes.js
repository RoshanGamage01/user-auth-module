const express = require('express');
const router = express.Router();
const AuthController = require('../App/controllers/AuthControllers');
const auth = require('../App/middlewares/Auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', auth, AuthController.logout);
router.post('/getAll', () => {});
router.post('/export-csv', () => {});
router.get('/me', () => {});
router.post('/mobile-login', () => {});
router.get('/validate', () => {});

module.exports = router;