const mongoose = require("mongoose");
const InteractionSchema = new mongoose.Schema({
   
    queryId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Query", 
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
  
  



const Interaction = mongoose.model("Interaction", InteractionSchema);
module.exports = Interaction;