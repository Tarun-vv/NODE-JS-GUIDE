const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// NOTE: SIGNUP ROUTE
router.post('/signup', authController.signup);
// NOTE: LOGIN ROUTE
router.post('/login', authController.login);

// NOTE: OTHER ROUTES
router.route('/').get(userController.getAllUsers);

module.exports = router;