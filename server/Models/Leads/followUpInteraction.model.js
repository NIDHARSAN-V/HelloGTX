const InteractionSchema = new mongoose.Schema({
    // Reference
    leadId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lead", 
      required: true,
      index: true
    },
    agentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },
  
    // Interaction Details
    type: { 
      type: String, 
      enum: [
        "inbound_call",
        "outbound_call",
        "email",
        "whatsapp",
        "sms",
        "meeting",
        "chat"
      ],
      required: true
    },
    direction: { 
      type: String, 
      enum: ["inbound", "outbound"],
      required: function() {
        return this.type.includes('call');
      }
    },
  
    // Call Specific
    callDetails: {
      duration: Number, // in seconds
      recordingUrl: String,
      fromNumber: String,
      toNumber: String,
      callSid: String // For Twilio
    },
  
    // Email Specific
    emailDetails: {
      subject: String,
      body: String,
      attachments: [String],
      messageId: String,
      inReplyTo: String
    },
  
    // WhatsApp Specific
    whatsappDetails: {
      messageId: String,
      from: String,
      to: String,
      body: String,
      mediaUrl: String,
      status: { 
        type: String, 
        enum: ["sent", "delivered", "read", "failed"] 
      }
    },
  
    // General
    summary: String,
    sentiment: { 
      type: String, 
      enum: ["positive", "neutral", "negative"] 
    },
    keywords: [String],
  
    // Follow-up
    requiresFollowUp: { type: Boolean, default: false },
    followUpDetails: {
      scheduledAt: Date,
      priority: { type: String, enum: ["low", "medium", "high"] },
      notes: String,
      completed: { type: Boolean, default: false },
      completedAt: Date
    },
  
    // Points & Performance
    pointsEarned: { type: Number, default: 0 },
    qualityRating: { type: Number, min: 1, max: 5 },
  
    // Timestamps
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: Date
  }, {
    timestamps: true
  });
  
  // Indexes
  InteractionSchema.index({ leadId: 1, createdAt: -1 });
  InteractionSchema.index({ agentId: 1, type: 1 });
  InteractionSchema.index({ "followUpDetails.scheduledAt": 1 });