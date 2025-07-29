const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  customerRef: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  employeeRef: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format"
    }
  },
  password: { 
    type: String, 
    required: true, 
    select: false,
    minlength: 8 
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[0-9]{10,15}$/.test(v),
      message: "Phone number must be 10-15 digits"
    }
  },
  alternatePhone: String,
  role: { 
    type: String, 
    enum: ["super_admin","employee", "admin", "customer"], 
    default: "customer",
    required: true
  },
  dateOfBirth: { type: Date },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginHistory: [{
    ipAddress: String,
    device: String,
    browser: String,
    os: String,
    timestamp: { type: Date, default: Date.now }
  }],
}, {
  timestamps: true,
});

// UserSchema.index({ email: 1 }, { unique: true });
// UserSchema.index({ phone: 1 }, { unique: true, sparse: true });

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);