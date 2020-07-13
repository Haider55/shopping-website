const express = require('express');
const router = express.Router();
// Load User Controller
const userController = require('../controllers/user.controller')
const { forwardAuthenticated } = require('../config/auth');
//const isAuthenticated=  (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/users/login');
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
router.get('/comment', forwardAuthenticated, userController.comment);
router.post('/comment', userController.commentUser);
router.get("/comment/:productId",userController.commentxProduct);

router.post('/comment', userController.commentUser);

// Login
router.post('/login', userController.loginUser);

router.get("/all",  userController.all);
router.get('/product_detail/:id', forwardAuthenticated, (req, res) => { 
    console.log(req.params.id);
    Product.findById(req.params.id, function(err, product) {
      if (err) {
        return res.status(400).json({
          err: `Oops something went wrong! Cannont find product with ${req.params.id}.`
        });
      }
      res.render('product_detail',{
        product
      });
    });
  })

// Logout
router.get('/logout', userController.logout);

module.exports = router;
