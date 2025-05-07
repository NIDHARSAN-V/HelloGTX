const UserSchema = new mongoose.Schema({
    // Identity
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
  
    // Roles & Permissions
    role: { 
      type: String, 
      enum: ["super_admin", "admin", "agent", "customer"], 
      default: "customer",
      required: true
    },
    permissions: {
      dashboard: { type: Boolean, default: false },
      leads: { type: Boolean, default: false },
      bookings: { type: Boolean, default: false },
      payments: { type: Boolean, default: false },
      reports: { type: Boolean, default: false },
      settings: { type: Boolean, default: false }
    },
  
    // Agent-Specific
    employeeId: { type: String, unique: true, sparse: true },
    department: {
      type: String,
      enum: ["sales", "operations", "customer_support", "marketing"]
    },
    joiningDate: Date,
    commissionRate: { 
      type: Number, 
      min: 0, 
      max: 100,
      default: 5 
    },
    targets: {
      monthlyLeads: Number,
      monthlySales: Number
    },
  
    // Customer-Specific
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
      postalCode: { type: String, trim: true }
    },
    passportDetails: {
      number: { type: String, trim: true },
      expiryDate: Date,
      issueDate: Date,
      issueCountry: String,
      scanFront: String, // URL to document
      scanBack: String
    },
    preferences: {
      preferredDestinations: [String],
      travelClass: { type: String, enum: ["economy", "business", "first"] },
      dietaryRequirements: [String]
    },
  
    // Authentication
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  
    // Status
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    loginHistory: [{
      ipAddress: String,
      device: String,
      browser: String,
      os: String,
      timestamp: { type: Date, default: Date.now }
    }],
  
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    deletedAt: Date // Soft delete
  }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
  
  // Indexes
  UserSchema.index({ email: 1 }, { unique: true });
  UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
  UserSchema.index({ role: 1, isActive: 1 });