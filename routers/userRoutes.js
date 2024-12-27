const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// NOTE: SIGNUP ROUTE
router.post('/signup', authController.signup);
// NOTE: LOGIN ROUTE
router.post('/login', authController.login);

// NOTE: PASSWORD RESET ROUTE
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

// NOTE: update user data
router.patch('/updateMe', authController.protect, userController.updateMe);

// NOTE: delete user
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// NOTE: OTHER ROUTES
router.route('/').get(userController.getAllUsers);

module.exports = router;
