const BookingSchema = new mongoose.Schema({
    // References
    leadId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lead", 
      required: true,
      index: true
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Customer", 
      required: true,
      index: true
    },
    empId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee", 
      index: true
    },

  
    // Booking Details
    bookingReference: { 
      type: String, 
      required: true,
      unique: true,
      uppercase: true
    },
    bookingType: { 
      type: String, 
      enum: [
        "flight",
        "hotel",
        "package",
        "custom",
        "transport",
        "activity"
      ],
      required: true
    },
    bookingDate: { 
      type: Date, 
      default: Date.now,
      index: true
    },
    travelDates: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    destinations: [{
      country: String,
      city: String,
      nights: Number
    }],
  
    // Pricing
    basePrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    currency: { 
      type: String, 
      default: "INR",
      uppercase: true
    },
  
    // Travelers
    travelers: [{
      name: { type: String, required: true },
      type: { type: String, enum: ["adult", "child", "infant"] },
      age: Number,
      passportNumber: String,
      passportExpiry: Date,
      visaRequired: Boolean,
      specialRequests: String
    }],
  
    // Status
    status: { 
      type: String, 
      enum: [
        "draft",
        "confirmed",
        "partially_paid",
        "fully_paid",
        "cancelled",
        "completed",
        "refunded"
      ],
      default: "draft",
      index: true
    },
    cancellationReason: String,
    cancellationDate: Date,
    cancellationCharges: Number,
  
    // Documents
    documents: [{
      name: String,
      type: { 
        type: String, 
        enum: [
          "voucher",
          "ticket",
          "invoice",
          "receipt",
          "contract",
          "visa",
          "insurance",
          "other"
        ]
      },
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
  
    // Communication
    sentDocuments: [{
      documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
      sentVia: { type: String, enum: ["email", "whatsapp", "sms"] },
      sentAt: Date,
      received: Boolean
    }],
  
    // Achkos Points
    pointsEarned: { type: Number, default: 0 },
    pointsRedeemed: { type: Number, default: 0 },
  
    // Metadata
    tags: [String],
    notes: [{
      content: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
      isInternal: { type: Boolean, default: false }
    }],
  
    // Timestamps
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: Date,
    completedAt: Date
  }, {
    timestamps: true
  });
  



  // Indexes
  BookingSchema.index({ bookingReference: 1 }, { unique: true });
  BookingSchema.index({ customerId: 1, status: 1 });
  BookingSchema.index({ agentId: 1, bookingDate: -1 });
  BookingSchema.index({ "travelDates.start": 1, "travelDates.end": 1 });
  BookingSchema.index({ "destinations.country": 1, "destinations.city": 1 });