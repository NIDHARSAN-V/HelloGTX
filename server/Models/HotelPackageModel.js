const HotelPackageSchema = new mongoose.Schema({
    // Hotel Details
    name: { type: String, required: true },
    chain: String,
    location: {
      address: String,
      city: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number
      },
      landmark: String
    },
    starRating: { type: Number, min: 1, max: 5 },
    amenities: [String],
  
    // Room Details
    roomType: { type: String, required: true },
    bedType: { type: String, enum: ["single", "double", "twin", "suite"] },
    maxOccupancy: { type: Number, default: 2 },
    roomView: String,
    roomAmenities: [String],
  
    // Stay Details
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
  
    // Pricing
    baseRate: { type: Number, required: true },
    taxes: { type: Number, required: true },
    fees: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    mealPlan: { 
      type: String, 
      enum: ["room_only", "breakfast", "half_board", "full_board", "all_inclusive"] 
    },
  
    // Policies
    cancellationPolicy: String,
    paymentPolicy: String,
    childPolicy: String,
  
    // Status
    status: { 
      type: String, 
      enum: ["available", "on_hold", "booked", "cancelled"],
      default: "available"
    },
  
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
  }, {
    timestamps: true
  });