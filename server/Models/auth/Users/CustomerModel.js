const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },


  passport: {
    passportNumber: { type: String, required: true },
    countryOfIssue: { type: String, required: true },
    dateOfIssue: { type: Date, required: true },
    dateOfExpiry: { type: Date, required: true },
    placeOfIssue: String,
    nationality: String,
    documentImage: String, // URL or path to uploaded image (e.g., S3 or local storage)
    isVerified: { type: Boolean, default: false }
  }, 
  
  
  nationality: String,
  preferredDestinations: [String],
  travelHistory: [
    {
      destination: String,
      fromDate: Date,
      toDate: Date,
      type: { type: String, enum: ["Domestic", "International"] },
      packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    },
  ],
  inquiries: [
    {
      subject: String,
      message: String,
      status: {
        type: String,
        enum: ["Open", "In Progress", "Closed"],
        default: "Open",
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  bookings: [
    {
      bookingId: String,
      destination: String,
      packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
      travelDate: Date,
      travelers: Number,
      amount: Number,
      status: {
        type: String,
        enum: ["Confirmed", "Pending", "Cancelled"],
        default: "Pending",
      },
      bookedAt: { type: Date, default: Date.now },
    },
  ],
  notes: [
    {
      text: String,
      addedBy: String,
      addedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
