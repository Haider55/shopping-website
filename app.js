const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var path = require("path");


const app = express();
// //node mailer code start
// require('dotenv').config();
// const nodemailer = require('nodemailer');
// const log = console.log;

// // Step 1
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL || 'gulfamhaider519@gmail.com', // TODO: your gmail account
//         pass: process.env.PASSWORD || '03424576552'// TODO: your gmail password
//     }
// });

// // Step 2
// let mailOptions = {
//     from: 'gulfamhaider519@gmail.com', // TODO: email sender
//     to: 'haiderqadri24@gmail.com', // TODO: email receiver
//     subject: 'Nodemailer - Test',
//     text: 'Wooohooo it works!!'
// };

// // Step 3
// transporter.sendMail(mailOptions, (err, data) => {
//     if (err) {
//         return log('Error occurs');
//     }
//     return log('Email sent!!!');
// });



// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//app.set("views", path.join(__dirname, "views/layouts"));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.employee_add_success_msg = req.flash("employee_add_success_msg");
  res.locals.employee_del_success_msg = req.flash("employee_del_success_msg");
  res.locals.employee_update_success_msg = req.flash(
    "employee_update_success_msg"
  );

  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use("/users", require("./routes/users.js"));
app.use("/employee", require("./routes/employee.route.js"));
//app.use("/contact", require("./routes/contact.js"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));




