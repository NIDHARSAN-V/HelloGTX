const CommissionSchema = new mongoose.Schema({
  // References
  agentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true
  },
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Booking",
    index: true
  },
  leadId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lead",
    index: true
  },

  // Commission Calculation
  commissionType: { 
    type: String, 
    enum: ["percentage", "fixed", "tiered", "bonus"],
    required: true
  },
  calculationMethod: {
    base: { type: String, enum: ["booking_amount", "profit", "package_price"] },
    rate: Number,
    minAmount: Number,
    maxAmount: Number
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: { 
    type: String, 
    default: "INR",
    uppercase: true
  },

  // Achkos Points System
  points: {
    earned: { type: Number, default: 0 },
    type: { 
      type: String, 
      enum: [
        "lead_conversion",
        "booking_closure",
        "upsell",
        "customer_satisfaction",
        "quick_response",
        "other"
      ]
    },
    rate: Number, // Points per currency unit
    expiryDate: Date
  },

  // Payment Status
  status: { 
    type: String, 
    enum: [
      "pending",
      "approved",
      "processed",
      "paid",
      "cancelled",
      "disputed"
    ],
    default: "pending"
  },
  paymentDetails: {
    method: { 
      type: String, 
      enum: ["bank_transfer", "upi", "cheque", "cash", "other"] 
    },
    reference: String,
    processedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },

  // Dispute Resolution
  dispute: {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: String,
    notes: String,
    resolution: String,
    resolvedAt: Date,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },

  // Audit Trail
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: [{
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
  }],

  // Timestamps
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: Date,
  paidAt: Date
}, {
  timestamps: true
});

// Indexes
CommissionSchema.index({ agentId: 1, status: 1 });
CommissionSchema.index({ bookingId: 1 });
CommissionSchema.index({ "points.expiryDate": 1 });
CommissionSchema.index({ createdAt: -1 });