const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  
  department: {
    type: String,
    enum: ["Sales", "Support", "Admin", "Operations"],       //teams roles 
  },




  leadId:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  }],

  

  empPerformId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployeePerformance",
  },


  userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true 
    }


  
});

module.exports = mongoose.model("Employee", employeeSchema);
