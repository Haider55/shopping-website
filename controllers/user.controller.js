const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const passport = require("passport");
// Load User model
const User = require("../models/User");
const Comment = require("../models/Comment");
var async = require("async");
 var nodemailer = require("nodemailer");
 var crypto = require("crypto");
 const { promisify } = require('util')


//Login Function
exports.login = (req, res) =>
  res.render("login"
    );

//Register Funcion
exports.register = (req, res) =>
  res.render("register");

  //email verification code here

  exports.verifyNewUser = (req,res) => {
    let token = req.query.token;
  
    //console.log('verifyNewUser',verifyNewUser);
  
    User.updateOne({token}, {
      verified: true,
  }, function(err, affected, resp) {
    
    if(err) res.send('Sorry wrong token or user not found!!!');
  
    
    req.flash(
      "user_verified",
      "You are now registered and can log in"
    );
  
    setTimeout(()=>{
      res.redirect('/login')
    },1500);
      
     console.log('user.update',resp);
  })
  
    /*User.findOne({ token }).then(user => {
      if (user) {
        res.send('User Verified!!!');
        req.flash(
          "success_msg",
          "You are now registered and can log in"
        );
  
        setTimeout(()=>{
          res.redirect('/login')
        },1500);
        
      } else {
        res.send('Sorry wrong token!!!');
      }
    });*/
  
    //check in db if token is available
  }
  
  //Handle Post Request to add a new user
  exports.registerUser = (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please enter all fields" });
    }
  
    if (password != password2) {
      errors.push({ msg: "Passwords do not match" });
    }
  
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
  
    if (errors.length > 0) {
      res.render("register", {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: "Email already exists" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            verified: false,
            token: uuidv4()
          });
         
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  console.log(user)
                  //get email here and send the mail, await for it then response
                  const transporter = nodemailer.createTransport({
                    //service: 'gmail',
                    host: "smtp.gmail.com",
                    port: 465, 
                    auth: {
                      user: 'gulfamhaider519@gmail.com',
                      pass: 'Gulfam@4576552'
                    }
                  });

                  const mailOptions = {
                    from: 'gulfamhaider519@gmail.com',
                    to: email,
                    subject: `You're almost there`,
                    text: `Hello ${name},
                    Please click the link to verify your email => ${req.headers.host}/verifyNewUser?token='${user.token}'`
                  };
  
                  console.log('mailoption',mailOptions);
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      // here show a temp page saying please check your email for getting registered
                      res.send('Please check your email for getting registered');
                      //res.redirect("/login");
                    }
                  });
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  };
  
//Handle Post Request to add a new user
// exports.registerUser = (req, res) => {
//   const { name, email, password, password2 } = req.body;
//   let errors = [];

//   if (!name || !email || !password || !password2) {
//     errors.push({ msg: "Please enter all fields" });
//   }

//   if (password != password2) {
//     errors.push({ msg: "Passwords do not match" });
//   }

//   if (password.length < 6) {
//     errors.push({ msg: "Password must be at least 6 characters" });
//   }

//   if (errors.length > 0) {
//     res.render("register", {
//       errors,
//       name,
//       email,
//       password,
//       password2
//     });
//   } else {
//     User.findOne({ email: email }).then(user => {
//       if (user) {
//         errors.push({ msg: "Email already exists" });
//         res.render("register", {
//           errors,
//           name,
//           email,
//           password,
//           password2
//         });
//       } else {
//         const newUser = new User({
//           name,
//           email,
//           password
//         });
       
//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then(user => {
//                 req.flash(
//                   "success_msg",
//                   "You are now registered and can log in"
//                 );
//                 res.redirect("/login");
//               })
//               .catch(err => console.log(err));
//           });
//         });
//       }
//     });
//   }
// };

//Handle post request to Login a user
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
};

// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};
// forgot password
// forgot password
// forgot password
exports.forgot=(req, res) =>
  res.render('forgot'
  );
//post request
exports.forgotUser=(req, res, next)=> { 
  console.log('forgotUser ---->', req.body, req.query)
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        console.log('forgotUser =====>', err, user, token)
        if (err || !user) {
          console.log('forgotUser 2222 =====>', err, user, token)
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'gulfamhaider519@gmail.com',
          pass: "Gulfam@4576552"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gulfamhaider519@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot?from=forgot');
  });
};

exports.reset=(req, res)=> {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
};
//post req
exports.resetUser=(req, res)=> {
  console.log('req.body resetUser ====>', req.body)
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function(err, user) 
      {
        console.log('user finone ===>', err, user)
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
            
          console.log('req.password password ===>', req.body.password)
          user.password=req.body.password;
          console.log('user.password ===>', user.password)

          let pwdBycrypt = promisify(bcrypt.genSalt).bind(bcrypt)
          let hashBycrypt = promisify(bcrypt.hash).bind(bcrypt)
          let salt = await pwdBycrypt(10)
          let hash = await hashBycrypt(user.password, salt)
          user.password = hash;
          console.log('password' + user.password  + 'and the user is' + user)
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          let result = await user.save();
          console.log(result, 'result result-----')
          if (!result) {
            console.log("user not updated");
            res.redirect('back');
          }
          else{
            console.log('password' + user.password  + 'and the user is' + user)
            req.login(user, function(err) {
              user.password = undefined
              done(err, user);
            });
          }
         }
        });
      },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'gulfamhaider519@gmail.com',
          pass: "Gulfam@4576552"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gulfamhaider519@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
};
//contact us
exports.contact = (req, res) =>
  res.render("contact"
    );
exports.contactUser=(req, res, next)=>{
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "gulfamhaider519@gmail.com", // generated ethereal user
      pass: "Gulfam@4576552"// generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: req.body.email, // sender address
    to: req.body.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text:req.body.message, // plain text body
    // html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
res.end("you message has been send successfully")

}

///chat with socket.io
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const users = {
    1: 'gul',
    2: 'fam'
}
// app.get('/chat', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });
// app.get('/style_', function(req, res){
//     res.sendFile(__dirname + '/index.css');
// });
// app.get('/js', function(req, res){
//     res.sendFile(__dirname + '/index_script.js');
// });
app.get('/user', function (req, res) {
    let list = {}
    for (let i = 1; i <= 5; i++)
        list[`user_${i}`] = `socket${parseInt(Math.random() * 10)*i}`
    res.send({
        users: list
    })
});
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('message', function(msg){
        console.log('message: ' + msg, JSON.parse(msg));
        io.emit('message', msg);
    });
    /* // message listener from server 
    socket.on('newMessage', function(message){ 
        console.log(message); 
    }); 
        
    // emits message from user side 
    socket.emit('createMessage', { 
        to:'john@ds', 
        text:'what kjkljd'
    });  */
});


/* 
    Here are some ideas to improve the application:

    - Broadcast a message to connected users when someone connects or disconnects.
    - Add support for nicknames.
    - Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
    - Add “{user} is typing” functionality.
    - Show who’s online.
    - Add private messaging.
    - Share your improvements!
 */
//comment system added
//comment system added controller
exports.comment = async (req, res) => {
  var id = req.body.productId; 
   const comments = await Comment.find({product : id})
  .populate("user")
  .exec();

  console.log(id);

//   render for product commets:
 const product = await Product.find({_id : id}).populate("user").exec();
  
   res.render("product_detail", {comments,product})
   // where returnt the view?...
};
//this is controller
exports.commentxProduct = async(req,res) => {
    var id = req.params.productId;
    console.log(id)

    const comments = await Comment.find({product: id}).populate("user").exec();

  console.log(id);
  console.log(comments)

    res.json(comments) 
};

exports.commentUser = ( req, res, next )=>{

  console.log(req.body);
  debugger
  passport.deserializeUser((id, done) => {
    debugger
    User.findOne(id);
  })
  
  //const commentEntity = new Comment({name, content, user:req.user.id});
  const commentEntity = new Comment(req.body); //here
  

  commentEntity.save((err) => {
    if(err) return next(err);
  });
  
  return res.redirect('/product_detail/'+req.body.product); 
  // Comment.find( function ( err, comments, count ){
  //   res.render( 'comment', {
  //       title : 'Comment System with Mongoose and Node',
  //       comments : comments
  //   });
  // }); now please show name of user or email
}; //comment system added controller
exports.comment = async (req, res) => {
  var id = req.body.productId; 
   const comments = await Comment.find({product : id})
  .populate("user")
  .exec();

  console.log(id);

//   render for product commets:
 const product = await Product.find({_id : id}).populate("user").exec();
  
   res.render("product_detail", {comments,product})
   // where returnt the view?...
};
//this is controller
exports.commentxProduct = async(req,res) => {
    var id = req.params.productId;
    console.log(id)

    const comments = await Comment.find({product: id}).populate("user").exec();

  console.log(id);
  console.log(comments)

    res.json(comments) 
};

exports.commentUser = ( req, res, next )=>{

  console.log(req.body);
  debugger
  passport.deserializeUser((id, done) => {
    debugger
    User.findOne(id);
  })
  
  //const commentEntity = new Comment({name, content, user:req.user.id});
  const commentEntity = new Comment(req.body); //here
  

  commentEntity.save((err) => {
    if(err) return next(err);
  });
  
  return res.redirect('/product_detail/'+req.body.product); 
  // Comment.find( function ( err, comments, count ){
  //   res.render( 'comment', {
  //       title : 'Comment System with Mongoose and Node',
  //       comments : comments
  //   });
  // }); now please show name of user or email
}; 

exports.all = (req, res) => {
  

  Product.find(function(err,products) {
   
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find products." });
    }
    // res.status(200).render("/productalluser", {
    //   products,
    // });
    res.json(products);
  });
};