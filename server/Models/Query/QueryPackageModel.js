const QueryPackageManagerSchema = new mongoose.Schema({
  // Core References
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    index: true
  },
  
  // Package References (make them conditionally required)
  customPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomPackage"
  },
  flightPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FlightPackage"
  },
  hotelPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HotelPackage"
  },
  activityPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActivityPackage"
  },
  visaPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VisaPackage"
  },
//   itineraryId: {                             //yet to be added 
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Itinerary"
//   },
//added
  // Status Tracking
  status: {
    type: String,
    enum: ["draft", "confirmed", "active", "completed", "cancelled"],
    default: "draft",
    index: true
  },

  // Financial Tracking
  totalCost: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "partial", "paid", "refunded"],
    default: "unpaid"
  },

  // Package Composition
  components: [{
    type: {
      type: String,
      enum: ["flight", "hotel", "activity", "visa", "transport", "other"],
      required: true
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    packageRef: {
      type: String,
      required: true,
      enum: ["CustomPackage", "FlightPackage", "HotelPackage", "ActivityPackage", "VisaPackage"]
    }
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  startDate: Date,
  endDate: Date
}, {
  timestamps: true
});

// Indexes
QueryPackageManagerSchema.index({ bookingId: 1, status: 1 });
QueryPackageManagerSchema.index({ status: 1, startDate: 1 });
QueryPackageManagerSchema.index({ "components.packageId": 1 });

// Validation to ensure at least one package is provided
QueryPackageManagerSchema.pre('validate', function(next) {
  if (!this.customPackageId && !this.flightPackageId && !this.hotelPackageId && 
      !this.activityPackageId && !this.visaPackageId) {
    this.invalidate('packages', 'At least one package must be provided');
  }
  next();
});