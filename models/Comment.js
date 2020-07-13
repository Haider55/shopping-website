const mongoose = require( 'mongoose' );
const commentSchema   = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    user: {type: mongoose.Types.ObjectId, ref: 'User'},
    name: String,
    content: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
    product: {type: mongoose.Types.ObjectId, ref: 'Product'}
})
 
const comment = mongoose.model('Comment', commentSchema);

module.exports = comment;
 
