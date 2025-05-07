const ActivityPackageSchema = new mongoose.Schema({
    // Activity Details
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: [
        "sightseeing",
        "adventure",
        "cultural",
        "cruise",
        "shopping",
        "food",
        "other"
      ],
      required: true
    },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
      meetingPoint: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    duration: { 
      value: Number,
      unit: { type: String, enum: ["hours", "days"] }
    },
    operatingDays: [String], // ["Monday", "Tuesday"]
    startTimes: [String], // ["09:00", "14:00"]
  
    // Description
    highlights: [String],
    inclusions: [String],
    exclusions: [String],
    requirements: [String], // e.g., "Passport copy", "Vaccination proof"
  
    // Pricing
    basePrice: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    pricingType: { 
      type: String, 
      enum: ["per_person", "per_group", "private_tour"],
      default: "per_person"
    },
  
    // Cancellation
    cancellationPolicy: {
      freeCancellationBefore: Number, // in hours
      cancellationFee: Number
    },
  
    // Status
    status: { 
      type: String, 
      enum: ["available", "on_request", "not_available"],
      default: "available"
    },
  
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
  }, {
    timestamps: true
  });