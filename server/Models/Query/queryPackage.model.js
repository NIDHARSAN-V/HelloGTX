const QueryPackageManagerSchema = new mongoose.Schema({

 leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
    index: true
  },


  onStatus: {
    type: String,
    enum: ["draft", "confirmed", "completed", "cancelled"],
  },

  

   // ======================
    // 1. CORE PACKAGE DETAILS
    // ======================
    name: {                                                       //filled and with itinerary
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
      mainImage: { type: String, required: true },      ///with itinerary 
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
      flights: { type: Boolean, default: false },     //with itinerary 
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

    flights: [                                                 //filled and with itinerary
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
        duration: Number, // in minutes
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
        refundable:{required:true ,  type:Boolean , default:false}, // whether the flight is refundable
      },
    ],


    

    hotels: [
      {
        day: { type: Number, required: true }, // Day of the trip
        name: { type: String, required: true },
        starRating: { type: Number, min: 1, max: 5 },
        location: {
          address: String,
          city: { type: String, required: true },
          coordinates: [Number], // [longitude, latitude]
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
        processingTime: String, // e.g., "5-7 business days"
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
            // Auto-calculate total if not provided
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
      enum: [ "sold_out", "active"],
      default: "active",
    },


    

  
  
    
  
    

  }
  



































//   // Core References
//   bookingId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Booking",
//     required: true,
//     index: true
//   },
  
//   // Package References (make them conditionally required)
//   customPackageId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "CustomPackage"
//   },
//   flightPackageId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "FlightPackage"
//   },
//   hotelPackageId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "HotelPackage"
//   },
//   activityPackageId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "ActivityPackage"
//   },
//   visaPackageId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "VisaPackage"
//   },
// //   itineraryId: {                             //yet to be added 
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Itinerary"
// //   },
// //added
//   // Status Tracking
//   status: {
//     type: String,
//     enum: ["draft", "confirmed", "active", "completed", "cancelled"],
//     default: "draft",
//     index: true
//   },

//   // Financial Tracking
//   totalCost: {
//     type: Number,
//     required: true
//   },
//   paidAmount: {
//     type: Number,
//     default: 0
//   },
//   paymentStatus: {
//     type: String,
//     enum: ["unpaid", "partial", "paid", "refunded"],
//     default: "unpaid"
//   },

//   // Package Composition
//   components: [{
//     type: {
//       type: String,
//       enum: ["flight", "hotel", "activity", "visa", "transport", "other"],
//       required: true
//     },
//     packageId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true
//     },
//     packageRef: {
//       type: String,
//       required: true,
//       enum: ["CustomPackage", "FlightPackage", "HotelPackage", "ActivityPackage", "VisaPackage"]
//     }
//   }],

//   // Timestamps
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: Date,
//   startDate: Date,
//   endDate: Date
// }, {
//   timestamps: true
// });

// // Indexes
// QueryPackageManagerSchema.index({ bookingId: 1, status: 1 });
// QueryPackageManagerSchema.index({ status: 1, startDate: 1 });
// QueryPackageManagerSchema.index({ "components.packageId": 1 });

// // Validation to ensure at least one package is provided
// QueryPackageManagerSchema.pre('validate', function(next) {
//   if (!this.customPackageId && !this.flightPackageId && !this.hotelPackageId && 
//       !this.activityPackageId && !this.visaPackageId) {
//     this.invalidate('packages', 'At least one package must be provided');
//   }
//   next();
// });