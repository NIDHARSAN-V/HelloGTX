
const mongoose = require("mongoose");


const LeadSchema = new mongoose.Schema({
  //mapped Queries[]

  queryId : [{
     type: mongoose.Schema.Types.ObjectId, 
      ref: "Query", 
      index: true

  }],


  

  //assignments


      assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee",
      index: true
    },


    assignedFor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Customer",
      index: true
    },







    
    // Basic Info


    
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format"
      }
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
    whatsappNumber: String,
  
    // Source Tracking
    source: { 
      type: String, 
      enum: [
        "website_form",
        "whatsapp",
        "phone_call",
        "walk_in",
        "referral",
        "social_media",
        "email_campaign",
        "other"
      ],
      required: true
    },

    
    sourceDetails: {
      campaignId: String,
      landingPage: String,
      referralCode: String,
      utmSource: String,
      utmMedium: String,
      utmCampaign: String
    },
  
    // Trip Details
    tripType: { 
      type: String, 
      enum: [
        "leisure",
        "business",
        "honeymoon",
        "family",
        "adventure",
        "group_tour",
        "custom_package",
        "not_specified"
      ],
      default: "not_specified",
    },
    destinations: [{
      country: { type: String, required: true },
      cities: [String],
      duration: Number // in days
    }],
    travelDates: {
      flexible: { type: Boolean, default: false },
      preferredMonths: [String],
      exactDates: {
        from: Date,
        to: Date
      }
    },
    travelers: {
      adults: { type: Number, min: 1, default: 1 },
      children: { type: Number, min: 0, default: 0 },
      infants: { type: Number, min: 0, default: 0 },
      details: [{
        name: String,
        age: Number,
        passportNumber: String
      }]
    },
    budget: {
      amount: Number,
      currency: { type: String, default: "INR" },
      flexibility: { type: String, enum: ["fixed", "flexible", "not_sure"] }
    },
  
    // Requirements
    accommodations: [{
      type: { type: String, enum: ["hotel", "resort", "villa", "homestay"] },
      stars: { type: Number, min: 1, max: 5 },
      specialRequests: String
    }],
    transportation: [{
      type: { type: String, enum: ["flight", "train", "car", "bus", "cruise"] },
      class: String,
      preferences: String
    }],
    activities: [String],
    specialRequirements: String,
  
    // Assignment & Status


    
    status: { 
      type: String, 
      enum: [
        "new",
        "contacted",
        "proposal_sent",
        "follow_up",
        "negotiation",
        "converted",
        "lost",
        "not_interested"
      ],
      default: "new",
      index: true
    },
    priority: { 
      type: String, 
      enum: ["low", "medium", "high", "vip"],
      default: "medium"
    },
    leadScore: { 
      type: Number, 
      min: 0, 
      max: 100, 
      default: 0 
    },
    conversionProbability: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
  
    // Timeline
    nextFollowUp: {
      date: Date,
      notes: String,
      reminderSent: Boolean
    },
    statusHistory: [{
      status: String,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now },
      notes: String
    }],
  
    // Documents
    documents: [{
      name: String,
      type: { type: String, enum: ["passport", "visa", "other"] },
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
  
    // Metadata
    tags: [String],
    notes: [{
      content: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
      isPrivate: { type: Boolean, default: false }
    }],
  
    // Timestamps
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: Date,
    convertedAt: Date
  }, {
    timestamps: true
  });
  
  // Indexes
  // LeadSchema.index({ email: 1 });
  // LeadSchema.index({ phone: 1 });
  // LeadSchema.index({ status: 1, priority: 1 });
  // LeadSchema.index({ assignedTo: 1, status: 1 });
  // LeadSchema.index({ "destinations.country": 1 });
  // LeadSchema.index({ "travelDates.exactDates.from": 1 });


  



  //   tasks: [
//     {
//       title: String,
//       description: String,
//       priority: {
//         type: String,
//         enum: ["Low", "Medium", "High"],
//         default: "Medium",
//       },
//       dueDate: Date,
//       status: {
//         type: String,
//         enum: ["Pending", "Completed", "In Progress"],
//         default: "Pending",
//       },
//       relatedCustomer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Customer",
//       },
//     },
//   ],


module.exports = mongoose.model("Lead", LeadSchema);

