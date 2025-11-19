const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  // ======================
  // 1. CORE REFERENCES
  // ======================
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
    index: true
  },

  customer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    name: String,
    email: String,
    contact: String,
    type: String
  },
  
  employee: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    email: String,
    name: String
  },

  // ======================
  // 2. QUERY STATUS
  // ======================
  onStatus: {
    type: String,
    enum: ["draft", "confirmed", "completed", "cancelled"],
    default: "draft"
  },

  // ======================
  // 3. FOLLOW-UP INTERACTIONS
  // ======================
  followupId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interaction",
    index: true
  }],

  // ======================
  // 4. INCLUSION FLAGS
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
  // 5. PACKAGE REQUIREMENTS
  // ======================
  package: {
    sourceCity: String,
    destinationCity: String,
    departureDate: Date,
    returnDate: Date,
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
    
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
    queryType: {
      type: String,
      enum: ["FIT", "GIT"],
      default: "FIT"
    },
    goingFrom: String,
    goingTo: String,
    specificDate: Date,
    noOfDays: Number,
    travellers: {
      type: Number,
      default: 2
    },
    priceRange: String,
    inclusions: [{
      type: String,
      enum: ['Flights', 'Hotels', 'Transfers', 'Meals', 'Sightseeing', 'Insurance', 'Visa Assistance']
    }],
    themes: [{
      type: String,
      enum: ['Beach', 'Adventure', 'Honeymoon', 'Family', 'Luxury', 'Wildlife', 'Cultural']
    }],
    hotelPreference: {
      type: String,
      default: "3"
    },
    foodPreferences: [{
      type: String,
      enum: ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Jain']
    }],
    remarks: String,
    expectedClosureDate: Date,
    expectedClosureAmount: Number
  },

  // ======================
  // 6. TRIP DATA (Grouped by Day and Date)
  // ======================
  tripData: [{
    day: { 
      type: Number, 
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    description: String,
    
    // Flight data for this day
    flight: {
      flightType: {
        type: String,
        enum: ["oneway", "roundtrip", "multicity"],
        default: "oneway"
      },
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
      refundable: { type: Boolean, default: false },
    },

    // Hotel data for this day
    hotel: {
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
      mealPlan: {
        type: String,
        enum: ["breakfast", "half_board", "full_board", "all_inclusive"],
        default: "breakfast"
      },
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 0 }
    },

    // Transfer data for this day
    transfer: {
      pickup: String,
      dropoff: String,
      vehicleType: {
        type: String,
        enum: ["Sedan", "SUV", "Van", "Luxury", "Bus"],
        default: "Sedan"
      },
      time: String,
      duration: String,
      cost: Number,
      remarks: String
    },

    // Visa data for this day
    visa: {
      country: { type: String, required: true },
      type: {
        type: String,
        enum: ["tourist", "business", "student"],
        required: true,
      },
      processingTime: String,
      requirements: [String],
      remarks: String
    },

    // Sightseeing data for this day
    sightseeing: {
      activity: String,
      location: String,
      duration: String,
      time: String,
      cost: Number,
      includes: [String],
      remarks: String
    },

    // Miscellaneous data for this day
    miscellaneous: {
      description: String,
      category: String,
      cost: Number,
      remarks: String
    },

    // Day notes
    notes: String
  }],

  // ======================
  // 7. COMPANY FORMATION REQUIREMENTS
  // ======================
  companyFormation: {
    description: String,
    requirements: [String],
    timeline: String,
    documents: [String],
    remarks: String,
    expectedClosureDate: Date,
    expectedClosureAmount: Number
  },

  // ======================
  // 8. FOREX REQUIREMENTS
  // ======================
  forex: {
    description: String,
    currency: String,
    amount: Number,
    exchangeRate: Number,
    deliveryDate: Date,
    remarks: String,
    expectedClosureDate: Date,
    expectedClosureAmount: Number
  },

  // ======================
  // 9. PRICING & PAYMENTS
  // ======================
  pricing: {
    basePrice: { type: Number, required: true },
    components: {
      flights: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      visas: { type: Number, default: 0 },
      transfers: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
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
  // 10. LOGISTICS & POLICIES
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
  // 11. SYSTEM FIELDS
  // ======================
  offStatus: {
    type: String,
    enum: ["sold_out", "active"],
    default: "active",
  },

  // ======================
  // 12. ITINERARY SENDING HISTORY
  // ======================
  itineraryHistory: [{
    sentAt: {
      type: Date,
      default: Date.now
    },
    sentTo: String,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },
    selectedItems: [{
      type: String,
      withAmount: Boolean
    }],
    htmlContent: String,
    status: {
      type: String,
      enum: ["sent", "delivered", "failed"],
      default: "sent"
    }
  }]

}, {
  timestamps: true
});

// ======================
// INSTANCE METHODS
// ======================
QuerySchema.methods.calculateTotal = function() {
  const components = this.pricing.components || {};
  let total = this.pricing.basePrice || 0;
  
  total += (components.flights || 0);
  total += (components.accommodation || 0);
  total += (components.visas || 0);
  total += (components.transfers || 0);
  total += (components.activities || 0);
  total += (components.taxes || 0);
  total += (components.fees || 0);
  
  // Apply discounts
  if (this.pricing.discounts) {
    if (this.pricing.discounts.earlyBird) total -= this.pricing.discounts.earlyBird;
    if (this.pricing.discounts.group) total -= this.pricing.discounts.group;
  }
  
  return Math.max(0, total);
};

// Method to get data for a specific day
QuerySchema.methods.getDayData = function(dayNumber) {
  return this.tripData.find(day => day.day === dayNumber) || null;
};

// Method to add or update day data
QuerySchema.methods.updateDayData = function(dayNumber, date, data) {
  const dayIndex = this.tripData.findIndex(day => day.day === dayNumber);
  
  const dayData = {
    day: dayNumber,
    date: date,
    description: data.description || `Day ${dayNumber}`,
    flight: data.flight || {},
    hotel: data.hotel || {},
    transfer: data.transfer || {},
    visa: data.visa || {},
    sightseeing: data.sightseeing || {},
    miscellaneous: data.miscellaneous || {},
    notes: data.notes || ''
  };

  if (dayIndex !== -1) {
    // Update existing day
    this.tripData[dayIndex] = { ...this.tripData[dayIndex], ...dayData };
  } else {
    // Add new day
    this.tripData.push(dayData);
  }

  // Sort by day number
  this.tripData.sort((a, b) => a.day - b.day);
};

// Method to generate comprehensive itinerary HTML
QuerySchema.methods.generateItineraryHTML = function() {
  // Implementation for generating HTML content
  return `<h1>Travel Itinerary</h1>`; // Simplified for example
};

// Pre-save middleware
QuerySchema.pre("save", function(next) {
  // Generate slug if new
  if (this.isNew && !this.slug) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    this.slug = `query-${timestamp}-${randomStr}`;
  }

  // Calculate total price if not set
  if (!this.pricing.totalPrice) {
    this.pricing.totalPrice = this.calculateTotal();
  }

  // Auto-populate package fields from tripData if empty
  if (this.tripData && this.tripData.length > 0) {
    const firstDay = this.tripData[0];
    const lastDay = this.tripData[this.tripData.length - 1];
    
    if (!this.package.goingFrom && firstDay.flight?.departure?.city) {
      this.package.goingFrom = firstDay.flight.departure.city;
    }
    if (!this.package.goingTo && firstDay.flight?.arrival?.city) {
      this.package.goingTo = firstDay.flight.arrival.city;
    }
    if (!this.package.specificDate && firstDay.date) {
      this.package.specificDate = firstDay.date;
    }
    if (!this.package.noOfDays) {
      this.package.noOfDays = this.tripData.length;
    }
  }

  next();
});

// Indexes
QuerySchema.index({ leadId: 1, createdAt: -1 });
QuerySchema.index({ "customer.id": 1 });
QuerySchema.index({ onStatus: 1 });
QuerySchema.index({ slug: 1 });
QuerySchema.index({ "tripData.day": 1 });
QuerySchema.index({ "tripData.date": 1 });

const Query = mongoose.model("Query", QuerySchema);
module.exports = Query;