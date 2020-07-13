const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ProductSchema = new Schema(
  {
    
    title: { type: String, required: true },
    imageURL: { type: String, required: false },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: {type: String, required:true}
  },
  {
    timestamps: true
  }
);

// Export the model
module.exports = mongoose.model("Product", ProductSchema);