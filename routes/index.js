const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Load User model
const User = require('../models/User');
const Product = require("../models/products");
const Comment = require("../models/Comment");
const userController = require('../controllers/user.controller')
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));
//register page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
router.get('/verifyNewUser', forwardAuthenticated, userController.verifyNewUser);
//login page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
//add page
router.get('/add', forwardAuthenticated, (req, res) => res.render('employee/employeeAdd'));
//contact page

router.get('/contact', forwardAuthenticated, (req, res) => res.render('contact'));
router.get('/forgot', forwardAuthenticated, (req, res) => res.render('forgot'));

router.get('/chat', forwardAuthenticated, (req, res) => res.render('chat'));
router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });

  router.get('/products/:category', forwardAuthenticated,async (req, res) =>{
    const products = await Product.find({category: req.params.category})
    res.render('products',{products});
  })
  
  router.get('/product/categories/:category',async (req, res) =>{
    try {
      const products = await Product.find({category: req.params.category})
    res.send(products);
    } catch (error) {
      res.send(error)
    }
  })
  
  router.get('/product/categories/:category/:subcategory',async (req, res) =>{
    try {
      const products = await Product.find({category: req.params.category,"subcategory":req.params.subcategory})
    res.send(products);
    } catch (error) {
      res.send(error)
    }
  })

  router.get('/product_detail/:id', (req, res) => {
    Product.findById(req.params.id, async function(err, product) {
      if (err) {
        return res.status(400).json({
          err: `Oops something went wrong! Cannont find product with ${req.params.id}.`
        });
      }
       const comments = await Comment.find({product: req.params.id}).populate("user").exec();
      res.render('product_detail',{
        product, comments
      });
    });
  })

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user,
    
  })
);

module.exports = router;
