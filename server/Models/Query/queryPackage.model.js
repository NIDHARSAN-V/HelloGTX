const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema(
  {
    // ======================
    // 1. CORE REFERENCES (from frontend)
    // ======================
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    customer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      name: String,
      email: String,
      contact: String,
      type: String,
    },

    employee: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
      email: String,
      name: String,
    },

    // ======================
    // 2. QUERY STATUS (from frontend formData.onStatus)
    // ======================
    onStatus: {
      type: String,
      enum: ["draft", "confirmed", "completed", "cancelled"],
      default: "draft",
    },

    // ======================
    // 3. FOLLOW-UP INTERACTIONS
    // ======================
    followupId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interaction",
        index: true,
      },
    ],

    // ======================
    // 4. PACKAGE DETAILS (from frontend formData.package)
    // ======================
    package: {
      queryType: {
        type: String,
        enum: ["FIT", "GIT"],
        default: "FIT",
      },
      goingFrom: String,
      goingTo: String,
      specificDate: Date,
      noOfDays: Number,
      travellers: {
        type: Number,
        default: 2,
      },
      priceRange: String,
      inclusions: [String],
      themes: [String],
      hotelPreference: {
        type: String,
        default: "3",
      },
      foodPreferences: [String],
      remarks: String,
      expectedClosureDate: Date,
      expectedClosureAmount: Number,
      name: String,
      description: String,
      tags: [String],
    },

    // ======================
    // 5. DAY-WISE DATA (from frontend dayWiseData)
    // ======================
    dayWiseData: {
      flights: [
        {
          day: { type: Number, required: true },
          date: Date,
          flightType: {
            type: String,
            enum: ["oneway", "roundtrip", "multicity"],
            default: "oneway",
          },
          airline: String,
          flightNumber: String,
          departure: {
            airport: String,
            terminal: String,
            datetime: Date,
            city: String,
          },
          arrival: {
            airport: String,
            terminal: String,
            datetime: Date,
            city: String,
          },
          duration: String,
          cabinClass: {
            type: String,
            enum: ["economy", "premium", "business", "first"],
            default: "economy",
          },
          baggage: {
            carryOn: {
              allowed: { type: Boolean, default: false },
              weight: String,
              dimensions: String,
            },
            checked: {
              allowed: { type: Boolean, default: false },
              pieces: String,
              weight: String,
            },
          },
          refundable: { type: Boolean, default: false },
          adults: { type: Number, default: 1 },
          children: { type: Number, default: 0 },
          infants: { type: Number, default: 0 },
          preferredAirline: String,
          selectionType: {
            type: String,
            enum: ["new", "existing", "thirdParty"],
            default: "new",
          },
          selectedFlightPackage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FlightPackage",
          },
          thirdPartyDetails: {
            pnr: String,
            supplier: String,
            cost: Number,
            confirmationFile: String,
          },
          price: Number,
          remarks: String,
        },
      ],

      hotels: [
        {
          day: { type: Number, required: true },
          date: Date,
          name: String,
          starRating: { type: Number, min: 1, max: 5 },
          location: {
            address: String,
            city: String,
            coordinates: [Number],
          },
          roomType: String,
          amenities: [String],
          checkIn: Date,
          checkOut: Date,
          cancellationPolicy: [String],
          mealPlan: {
            type: String,
            enum: ["breakfast", "half_board", "full_board", "all_inclusive"],
            default: "breakfast",
          },
          adults: { type: Number, default: 2 },
          children: { type: Number, default: 0 },
          selectionType: {
            type: String,
            enum: ["new", "existing", "thirdParty"],
            default: "new",
          },
          selectedHotelPackage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HotelPackage",
          },
          thirdPartyDetails: {
            confirmationNumber: String,
            supplier: String,
            cost: Number,
            voucherFile: String,
          },
          price: Number,
          remarks: String,
        },
      ],

      transfers: [
        {
          day: { type: Number, required: true },
          date: Date,
          pickup: String,
          dropoff: String,
          vehicleType: {
            type: String,
            enum: ["Sedan", "SUV", "Van", "Luxury", "Bus"],
            default: "Sedan",
          },
          time: String,
          duration: String,
          cost: Number,
          price: Number,
          remarks: String,
        },
      ],

      visas: [
        {
          day: { type: Number, required: true },
          date: Date,
          country: String,
          type: {
            type: String,
            enum: ["tourist", "business", "student", "work"],
            default: "tourist",
          },
          processingTime: String,
          requirements: [String],
          price: Number,
          remarks: String,
        },
      ],

      sightseeing: [
        {
          day: { type: Number, required: true },
          date: Date,
          activity: String,
          location: String,
          duration: String,
          time: String,
          cost: Number,
          price: Number,
          includes: [String],
          remarks: String,
        },
      ],

      miscellaneous: [
        {
          day: { type: Number, required: true },
          date: Date,
          description: String,
          category: String,
          cost: Number,
          price: Number,
          remarks: String,
        },
      ],

      companyFormation: [
        {
          day: { type: Number, required: true },
          date: Date,
          description: String,
          requirements: [String],
          timeline: String,
          documents: [String],
          price: Number,
          remarks: String,
          expectedClosureDate: Date,
          expectedClosureAmount: Number,
        },
      ],

      forex: [
        {
          day: { type: Number, required: true },
          date: Date,
          description: String,
          currency: {
            type: String,
            default: "USD",
            enum: ["USD", "EUR", "GBP", "INR"],
          },
          amount: Number,
          exchangeRate: Number,
          deliveryDate: Date,
          price: Number,
          remarks: String,
          expectedClosureDate: Date,
          expectedClosureAmount: Number,
        },
      ],
    },

    // ======================
    // 6. INCLUSION FLAGS (calculated from requirement types)
    // ======================
    includes: {
      flights: { type: Boolean, default: false },
      hotels: { type: Boolean, default: false },
      visas: { type: Boolean, default: false },
      meals: {
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
      },
      transfers: { type: Boolean, default: false },
      activities: { type: Boolean, default: false },
      insurance: { type: Boolean, default: false },
    },

    // ======================
    // 7. PRICING (from frontend formData.pricing)
    // ======================
    pricing: {
      basePrice: { type: Number, default: 0 },
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
      totalPrice: { type: Number, default: 0 },
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
    // 8. TOP-LEVEL FIELDS (from frontend formData)
    // ======================
    expectedClosureDate: Date,
    expectedClosureAmount: Number,
    remarks: String,

    // ======================
    // 9. SYSTEM FIELDS
    // ======================
    offStatus: {
      type: String,
      enum: ["sold_out", "active"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// ======================
// INSTANCE METHODS
// ======================
QuerySchema.methods.calculateTotalPrice = function () {
  let total = 0;

  // Add package expected closure amount
  if (this.package.expectedClosureAmount) {
    total += this.package.expectedClosureAmount;
  }

  // Add day-wise prices from all categories
  const categories = ['flights', 'hotels', 'transfers', 'visas', 'sightseeing', 'miscellaneous', 'companyFormation', 'forex'];
  
  categories.forEach(category => {
    if (this.dayWiseData[category]) {
      this.dayWiseData[category].forEach(item => {
        if (item.price) {
          total += item.price;
        }
      });
    }
  });

  return total;
};

QuerySchema.methods.generateItineraryHTML = function () {
  // This will be implemented in the controller based on your frontend function
  return `<h1>Travel Itinerary</h1>`;
};

// ======================
// PRE-SAVE MIDDLEWARE
// ======================
QuerySchema.pre("save", function (next) {
  // Calculate total price if not set
  if (!this.pricing.totalPrice || this.pricing.totalPrice === 0) {
    this.pricing.totalPrice = this.calculateTotalPrice();
  }

  // Auto-populate includes based on dayWiseData
  if (this.dayWiseData.flights && this.dayWiseData.flights.length > 0) {
    this.includes.flights = true;
  }
  if (this.dayWiseData.hotels && this.dayWiseData.hotels.length > 0) {
    this.includes.hotels = true;
  }
  if (this.dayWiseData.visas && this.dayWiseData.visas.length > 0) {
    this.includes.visas = true;
  }
  if (this.dayWiseData.transfers && this.dayWiseData.transfers.length > 0) {
    this.includes.transfers = true;
  }
  if (this.dayWiseData.sightseeing && this.dayWiseData.sightseeing.length > 0) {
    this.includes.activities = true;
  }

  // Set insurance inclusion if present in package inclusions
  if (this.package.inclusions && this.package.inclusions.includes('Insurance')) {
    this.includes.insurance = true;
  }

  next();
});

// ======================
// INDEXES
// ======================
QuerySchema.index({ leadId: 1, createdAt: -1 });
QuerySchema.index({ "customer.id": 1 });
QuerySchema.index({ onStatus: 1 });
QuerySchema.index({ createdAt: -1 });

const Query = mongoose.model("Query", QuerySchema);
module.exports = Query;