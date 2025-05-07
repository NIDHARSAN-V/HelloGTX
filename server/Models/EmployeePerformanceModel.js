const AgentPerformanceSchema = new mongoose.Schema({
    // Reference
    agentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },
  
    // Time Period
    periodType: { 
      type: String, 
      enum: ["daily", "weekly", "monthly", "quarterly", "yearly", "custom"],
      required: true
    },
    startDate: { 
      type: Date, 
      required: true,
      index: true
    },
    endDate: { 
      type: Date, 
      required: true,
      index: true
    },
  
    // Lead Metrics
    leadsAssigned: { type: Number, default: 0 },
    leadsContacted: { type: Number, default: 0 },
    leadsConverted: { type: Number, default: 0 },
    leadConversionRate: Number,
    averageLeadResponseTime: Number, // in minutes
  
    // Sales Metrics
    bookingsCreated: { type: Number, default: 0 },
    bookingValue: { type: Number, default: 0 },
    averageBookingValue: Number,
    cancellations: { type: Number, default: 0 },
    cancellationRate: Number,
  
    // Commission & Earnings
    totalCommission: { type: Number, default: 0 },
    commissionPaid: { type: Number, default: 0 },
    commissionPending: { type: Number, default: 0 },
  
    // Achkos Points
    pointsEarned: { type: Number, default: 0 },
    pointsBreakdown: {
      leadConversion: { type: Number, default: 0 },
      bookingClosure: { type: Number, default: 0 },
      customerSatisfaction: { type: Number, default: 0 },
      quickResponse: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    pointsRedeemed: { type: Number, default: 0 },
    pointsBalance: { type: Number, default: 0 },
  
    // Quality Metrics
    averageRating: { 
      type: Number, 
      min: 0, 
      max: 5,
      default: 0
    },
    customerFeedback: [{
      rating: Number,
      comments: String,
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
      date: { type: Date, default: Date.now }
    }],
  
    // Targets vs Achievement
    targets: {
      leads: Number,
      conversions: Number,
      sales: Number,
      commission: Number,
      points: Number
    },
    achievementPercentage: Number,
  
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    lastCalculatedAt: Date
  }, {
    timestamps: true
  });
  
  // Indexes
  AgentPerformanceSchema.index({ agentId: 1, startDate: -1 });
  AgentPerformanceSchema.index({ periodType: 1, endDate: -1 });
  AgentPerformanceSchema.index({ "targets.leads": 1, "targets.sales": 1 });