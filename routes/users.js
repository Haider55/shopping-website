const express = require('express');
const router = express.Router();
// Load User Controller
const userController = require('../controllers/user.controller')
const { forwardAuthenticated } = require('../config/auth');
const isAuthenticated=  (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/users/login');
//Register Routes
// Login Page
router.get('/login', forwardAuthenticated, userController.login);
// Register Page
router.get('/register', forwardAuthenticated, userController.register);
router.get('/forgot', forwardAuthenticated, userController.forgot);
router.get('/reset/:token', forwardAuthenticated, userController.reset);

// Register
router.post('/register', userController.registerUser);
router.post('/forgot', userController.forgotUser);
router.post('/reset/:token', userController.resetUser);
router.get('/contact', forwardAuthenticated, userController.contact);
router.post('/contact', userController.contactUser);
router.get('/comment', isAuthenticated, userController.comment);

router.post('/comment', userController.commentUser);

// Login
router.post('/login', userController.loginUser);

// Logout
router.get('/logout', userController.logout);

module.exports = router;
