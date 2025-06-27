const PaymentMilestoneSchema = new mongoose.Schema({
    bookingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Booking", 
      required: true,
      index: true
    },
    leadId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lead", 
      required: true,
      index: true
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },


  
    // Milestone Details
    name: { 
      type: String, 
      required: true,
      enum: [
        "booking_fee",
        "initial_deposit",
        "interim_payment",
        "final_payment",
        "security_deposit",
        "custom"
      ]
    },
    customName: String,
    description: String,
    dueDate: { 
      type: Date, 
      required: true,
      index: true
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
    taxAmount: Number,
    discountAmount: Number,
    totalAmount: Number,
  
    // Payment Status
    status: { 
      type: String, 
      enum: [
        "pending",
        "partially_paid",
        "paid",
        "overdue",
        "cancelled",
        "refunded"
      ],
      default: "pending"
    },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: Number,
  
    // Payment Methods
    paymentMethod: { 
      type: String, 
      enum: [
        "credit_card",
        "debit_card",
        "net_banking",
        "upi",
        "wallet",
        "bank_transfer",
        "cash",
        "cheque",
        "other"
      ]
    },


    paymentGateway: String,
    paymentGatewayReference: String,
    //
  
    // Transactions
    transactions: [{
      amount: Number,
      date: { type: Date, default: Date.now },
      method: String,
      reference: String,
      initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      notes: String,
      receiptUrl: String
    }],
  


    // Achkos Points
    pointsAwarded: { type: Number, default: 0 },
    pointsRate: Number, // Points per currency unit
  
    // Reminders & Notifications
    reminders: [{
      sentAt: Date,
      method: { type: String, enum: ["email", "sms", "whatsapp"] },
      templateId: String,
      response: String
    }],



  
    // Documents
    invoiceNumber: String,
    invoiceUrl: String,
    receiptNumber: String,
    receiptUrl: String,


  
    // Metadata
    notes: [{
      content: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now }
    }],


  
    // Timestamps
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: Date,
    completedAt: Date
  }, {
    timestamps: true
  });



  
  // Indexes
  PaymentMilestoneSchema.index({ dueDate: 1, status: 1 });
  PaymentMilestoneSchema.index({ bookingId: 1, status: 1 });
  PaymentMilestoneSchema.index({ customerId: 1 });
  PaymentMilestoneSchema.index({ "transactions.date": -1 });


  //transx