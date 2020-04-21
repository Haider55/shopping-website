const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let EmployeeSchema = new Schema(
  {
    
    name: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

// Export the model
module.exports = mongoose.model("Employee", EmployeeSchema);


