const express = require('express');
const http = require('http');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var path = require("path");


const app = express();
// chat with soket.io
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
app.get('/chat', (req, res) => res.render('chat'));



// socket io  start
var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', (socket)=>{
  console.log('conection', socket.id);
  socket.emit('connected', `socket server connection established ${socket}`);
  socket.on('message',(data)=>{
    var res = JSON.parse(data);
    res['client_id'] = socket.id;
    console.log('message',res);
    socket.broadcast.emit(res);
    io.emit('message', res);
  })
})


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



const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));




