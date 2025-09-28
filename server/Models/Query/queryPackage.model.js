const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
    index: true
  },

  // NEW FIELD: Reference to follow-up interactions
  followupId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interaction",
    index: true
  }],

  onStatus: {
    type: String,
    enum: ["draft", "confirmed", "completed", "cancelled"],
  },

  // ======================
  // 1. CORE PACKAGE DETAILS
  // ======================
  name: {
    type: String,
    required: [true, "Package name is required"],
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [50, "Description should be at least 50 characters"],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  images: {
    mainImage: { type: String, required: true },
    gallery: [String],
  },
  tags: {
    type: [String],
    enum: {
      values: ["family", "honeymoon", "adventure", "luxury", "budget"],
      message: "{VALUE} is not a valid tag",
    },
  },

  // ======================
  // 2. INCLUSION FLAGS
  // ======================
  includes: {
    flights: { type: Boolean, default: false },
    hotels: { type: Boolean, default: false },
    visas: { type: Boolean, default: false },
    meals: {
      breakfast: Boolean,
      lunch: Boolean,
      dinner: Boolean,
    },
    transfers: Boolean,
    activities: Boolean,
    insurance: Boolean,
  },

  // ======================
  // 3. TRAVEL COMPONENTS
  // ======================
  flights: [
    {
      airline: { type: String, required: true },
      flightNumber: { type: String, required: true },
      departure: {
        airport: { type: String, required: true },
        terminal: String,
        datetime: { type: Date, required: true },
        city: { type: String, required: true },
      },
      arrival: {
        airport: { type: String, required: true },
        terminal: String,
        datetime: { type: Date, required: true },
        city: { type: String, required: true },
      },
      duration: Number,
      cabinClass: {
        type: String,
        enum: ["economy", "premium", "business", "first"],
        default: "economy",
      },
      baggage: {
        carryOn: {
          allowed: Boolean,
          weight: Number,
          dimensions: String,
        },
        checked: {
          allowed: Boolean,
          pieces: Number,
          weight: Number,
        },
      },
      refundable: { required: true, type: Boolean, default: false },
    },
  ],

  hotels: [
    {
      day: { type: Number, required: true },
      name: { type: String, required: true },
      starRating: { type: Number, min: 1, max: 5 },
      location: {
        address: String,
        city: { type: String, required: true },
        coordinates: [Number],
      },
      roomType: { type: String, required: true },
      amenities: [String],
      checkIn: { type: Date, required: true },
      checkOut: { type: Date, required: true },
      cancellationPolicy: [String],
    },
  ],

  visas: [
    {
      country: { type: String, required: true },
      type: {
        type: String,
        enum: ["tourist", "business", "student"],
        required: true,
      },
      processingTime: String,
      requirements: [String],
    },
  ],

  // ======================
  // 4. PRICING & PAYMENTS
  // ======================
  pricing: {
    basePrice: { type: Number, required: true },
    components: {
      flights: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      visas: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      fees: { type: Number, default: 0 },
    },
    discounts: {
      earlyBird: Number,
      group: Number,
      promoCode: String,
    },
    totalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          if (!value) {
            return this.calculateTotal();
          }
          return true;
        },
        message: "Total price validation failed",
      },
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "INR"],
    },
    paymentPlan: {
      depositRequired: Boolean,
      depositAmount: Number,
      installmentOptions: [
        {
          percentage: Number,
          dueDate: Date,
        },
      ],
    },
  },

  // ======================
  // 5. LOGISTICS & POLICIES
  // ======================
  cancellationPolicy: {
    freeCancellation: Boolean,
    deadline: Date,
    penalty: {
      percentage: Number,
      flatFee: Number,
    },
  },
  termsConditions: String,

  // ======================
  // 6. SYSTEM FIELDS
  // ======================
  offStatus: {
    type: String,
    enum: ["sold_out", "active"],
    default: "active",
  },

}, {
  timestamps: true
});

const Query = mongoose.model("Query", QuerySchema);
module.exports = Query;