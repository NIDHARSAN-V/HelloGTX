const VisaPackageSchema = new mongoose.Schema({
    // Visa Details
    country: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["tourist", "business", "student", "work", "transit"],
      required: true
    },
    processingType: { 
      type: String, 
      enum: ["normal", "express", "premium"],
      required: true
    },
    duration: { 
      type: String, 
      enum: ["15_days", "30_days", "90_days", "6_months", "1_year", "multiple"],
      required: true
    },
    entryType: { 
      type: String, 
      enum: ["single", "double", "multiple"],
      required: true
    },
  
    // Requirements
    requirements: [{
      name: String,
      description: String,
      isMandatory: { type: Boolean, default: true }
    }],
  
    // Processing
    processingTime: Number, // in days
    embassyAddress: String,
    submissionMethod: { 
      type: String, 
      enum: ["in_person", "online", "courier"] 
    },
  
    // Pricing
    governmentFee: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },
  
    // Status
    status: { 
      type: String, 
      enum: ["available", "processing", "approved", "rejected"],
      default: "available"
    },
  
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
  }, {
    timestamps: true
  });