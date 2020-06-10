const mongoose = require( 'mongoose' );
const commentSchema   = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    user: {type: mongoose.Types.ObjectId, ref: 'User'},
    content: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
})
 
const comment = mongoose.model('Comment', commentSchema);

module.exports = comment;
 
