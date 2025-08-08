const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  
  department: {
    type: String,
    enum: ["Sales", "Support", "Admin", "Operations"],       //teams roles 
  },

  assignedCustomers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  ],


  leadId:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  }],

  empPerformId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployeePerformance",
  },


  
});

module.exports = mongoose.model("Employee", employeeSchema);
