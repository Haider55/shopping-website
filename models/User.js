const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  // token: {
  //   type: String,
  //   required: true
  // },
  // verified: {
  //   type: Boolean,
  //   required:true
  // },
  password: {
    type: String,
    required: true
  },
 
  resetPasswordToken:{
    type: String
  },
    resetPasswordExpires: {
      type: Date
    },
    salt: {
      type: String
    },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

