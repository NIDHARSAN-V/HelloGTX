const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  role: {
    type: String,
    enum: ["Sales", "Support", "Admin", "Operations"],
    default: "Sales",
  },
  department: String,
  assignedCustomers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  ],
  tasks: [
    {
      title: String,
      description: String,
      priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
      },
      dueDate: Date,
      status: {
        type: String,
        enum: ["Pending", "Completed", "In Progress"],
        default: "Pending",
      },
      relatedCustomer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    },
  ],
  loginCredentials: {
    username: String,
    password: String, // should be hashed
  },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
