const mongoose = require("mongoose");

const FlightPackageSchema = new mongoose.Schema(
  {
    // Flight Details
    airline: { type: String, required: true },
    flightNumber: { type: String, required: true },
    departure: {
      airport: { type: String, required: true },
      city: { type: String, required: true },
      terminal: String,
      datetime: { type: Date, required: true },
    },
    arrival: {
      airport: { type: String, required: true },
      city: { type: String, required: true },
      terminal: String,
      datetime: { type: Date, required: true },
    },
    duration: Number, // in minutes
    stops: {
      count: { type: Number, default: 0 },
      details: [
        {
          airport: String,
          city: String,
          duration: Number, // layover in minutes
        },
      ],
    },

    image: { type: String }, // URL to flight image

    // Booking Class
    class: {
      type: String,
      enum: ["economy", "premium_economy", "business", "first"],
      required: true,
    },
    fareType: { type: String }, // e.g., "refundable", "non-refundable"

    // Pricing
    baseFare: { type: Number, required: true },
    taxes: { type: Number, required: true },
    fees: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },

    // Baggage
    baggageAllowance: {
      cabin: {
        weight: Number,
        unit: { type: String, default: "kg" },
        dimensions: String, // "L+W+H"
      },
      checked: {
        pieces: Number,
        weightPerPiece: Number,
        unit: { type: String, default: "kg" },
      },
    },

    // Terms
    cancellationPolicy: String,
    changePolicy: String,

    // Status
    status: {
      type: String,
      enum: ["available", "on_hold", "booked", "cancelled"],
      default: "available",
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  },
  {
    timestamps: true,
  }
);

const FlightPackage = mongoose.model("FlightPackage", FlightPackageSchema);
module.exports = FlightPackage;
