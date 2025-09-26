
// const User = require("../../Models/Auth/user.model");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const emailjs = require('@emailjs/nodejs');
// const crypto = require("crypto");
// const Customer = require("../../Models/Auth/Users/customer.model")
// const Employee = require("../../Models/Auth/Users/empolyee.model");

// const Lead =  require("../../Models/Leads/lead.model");

// const createNewQuery = async (req, res) => {
//   try {

//          console.log(req.body , "Request body in query controller")

         
        






//   } catch (error) {
//     console.error("Error creating query:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// module.exports = {
//   createNewQuery
// };








const Query = require("../../Models/Query/queryPackage.model");
const Lead = require("../../Models/Leads/lead.model");

const createNewQuery = async (req, res) => {
  try {
    console.log(req.body, "Request body in query controller");

    const { formData, leadId, customer, employee } = req.body;

    // Validate required fields
    if (!leadId || !customer || !employee) {
      return res.status(400).json({
        message: "Missing required fields: leadId, customer, or employee"
      });
    }

    // Check if lead exists
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Map form data to your Query schema structure
    const queryData = mapFormDataToQuerySchema(formData, leadId, customer, employee);

    // Create the query
    const newQuery = new Query(queryData);
    const savedQuery = await newQuery.save();

    // Update the lead with the new query reference
    await Lead.findByIdAndUpdate(leadId, {
      $push: { queryId: savedQuery._id },
      $set: { 
        status: 'follow_up',
        updatedAt: new Date()
      }
    });

    // Add status history entry
    await Lead.findByIdAndUpdate(leadId, {
      $push: {
        statusHistory: {
          status: 'follow_up',
          changedBy: employee.id || employee._id,
          timestamp: new Date(),
          notes: `New query created: ${queryData.name}`
        }
      }
    });

    console.log('Query created successfully:', savedQuery._id);

    res.status(201).json({
      message: "Query created successfully",
      query: savedQuery,
      leadUpdated: true
    });

  } catch (error) {
    console.error("Error creating query:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry found"
      });
    }

    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Helper function to map form data to your schema
const mapFormDataToQuerySchema = (formData, leadId, customer, employee) => {
  const customerName = `${customer.user.firstName} ${customer.user.lastName}`;
  const currentDate = new Date();
  
  // Determine query type based on active requirement
  const queryType = determineQueryType(formData);
  
  // FIXED: Use correct tag values that match your schema enum
  const validTags = ["family", "honeymoon", "adventure", "luxury", "budget"];
  
  // Convert frontend themes to lowercase and filter valid ones
  const filteredThemes = (formData.themes || []).map(theme => theme.toLowerCase())
    .filter(theme => validTags.includes(theme));
  
  // If no valid themes, use a default
  const finalTags = filteredThemes.length > 0 ? filteredThemes : ["custom"];

  const baseQuery = {
    leadId: leadId,
    onStatus: "draft",
    name: `${customerName} - ${queryType} Package - ${currentDate.toLocaleDateString()}`,
    description: generateDescription(formData, queryType, customerName),
    slug: generateSlug(customerName, queryType, currentDate),
    images: {
      mainImage: "https://via.placeholder.com/800x600?text=Travel+Package",
      gallery: []
    },
    tags: finalTags, // ✅ FIXED: Now uses properly filtered tags
    offStatus: "active",
    createdAt: currentDate,
    updatedAt: currentDate
  };

  // Add pricing (required field)
  const pricing = mapPricing(formData, queryType.toLowerCase());
  
  // Add type-specific data
  if (formData.includes && formData.includes.includes('Flights')) {
    return {
      ...baseQuery,
      includes: { 
        flights: true, 
        hotels: formData.includes.includes('Hotels'), 
        visas: formData.includes.includes('Visa Assistance'), 
        meals: mapMealPlan(formData), 
        transfers: formData.includes.includes('Transfers'), 
        activities: formData.includes.includes('Sightseeing'), 
        insurance: formData.includes.includes('Insurance') 
      },
      flights: mapFlightData(formData),
      pricing: pricing
    };
  }
  
  if (formData.hotelSelectionType) {
    return {
      ...baseQuery,
      includes: { 
        flights: false, 
        hotels: true, 
        visas: false, 
        meals: mapMealPlan(formData), 
        transfers: false, 
        activities: false, 
        insurance: false 
      },
      hotels: mapHotelData(formData),
      pricing: pricing
    };
  }

  // Default package type
  return {
    ...baseQuery,
    includes: mapPackageIncludes(formData),
    flights: formData.includes?.includes('Flights') ? mapFlightData(formData) : [],
    hotels: formData.includes?.includes('Hotels') ? mapHotelData(formData) : [],
    visas: formData.includes?.includes('Visa Assistance') ? mapVisaData(formData) : [],
    pricing: pricing
  };
};

// Helper functions
const determineQueryType = (formData) => {
  if (formData.flightSelectionType) return 'Flight';
  if (formData.hotelSelectionType) return 'Hotel';
  if (formData.goingFrom && formData.goingTo) return 'Package';
  return 'Custom';
};

const generateDescription = (formData, queryType, customerName) => {
  let description = `Custom ${queryType.toLowerCase()} package for ${customerName}`;
  
  if (formData.goingFrom && formData.goingTo) {
    description += ` from ${formData.goingFrom} to ${formData.goingTo}`;
  }
  
  if (formData.noOfDays) {
    description += ` for ${formData.noOfDays} days`;
  }
  
  if (formData.travellers) {
    description += ` with ${formData.travellers} travellers`;
  }
  
  if (formData.remarks) {
    description += `\n\nSpecial Requirements: ${formData.remarks}`;
  }
  
  // Ensure minimum length for schema validation (50 characters)
  if (description.length < 50) {
    description += ". This custom travel package includes all requested services and accommodations tailored to your preferences.";
  }
  
  return description;
};

const generateSlug = (customerName, queryType, date) => {
  const baseSlug = `${customerName.toLowerCase().replace(/\s+/g, '-')}-${queryType.toLowerCase()}-${date.getTime()}`;
  return baseSlug.substring(0, 100);
};

const mapFlightData = (formData) => {
  const departureDate = formData.departureDate ? new Date(formData.departureDate) : new Date();
  const arrivalDate = formData.returnDate ? new Date(formData.returnDate) : new Date(departureDate.getTime() + 2 * 60 * 60 * 1000);
  
  return [{
    airline: formData.preferredAirline || "To be determined",
    flightNumber: formData.flightNumber || "TBD-" + Math.random().toString(36).substr(2, 4).toUpperCase(),
    departure: {
      airport: formData.sourceCity || "To be determined",
      terminal: "TBD",
      datetime: departureDate,
      city: formData.sourceCity || "To be determined"
    },
    arrival: {
      airport: formData.destinationCity || "To be determined",
      terminal: "TBD",
      datetime: arrivalDate,
      city: formData.destinationCity || "To be determined"
    },
    duration: calculateFlightDuration(formData),
    cabinClass: formData.flightClass || "economy",
    baggage: {
      carryOn: {
        allowed: true,
        weight: 7,
        dimensions: "55x40x20 cm"
      },
      checked: {
        allowed: true,
        pieces: 1,
        weight: 20
      }
    },
    refundable: false
  }];
};

const mapHotelData = (formData) => {
  const checkIn = formData.hotelDetails?.checkIn ? new Date(formData.hotelDetails.checkIn) : new Date();
  const checkOut = formData.hotelDetails?.checkOut ? new Date(formData.hotelDetails.checkOut) : new Date(checkIn.getTime() + 86400000);
  
  return [{
    day: 1,
    name: "Selected Hotel - " + (formData.goingTo || "Destination"),
    starRating: parseInt(formData.hotelPreference) || 3,
    location: {
      address: "To be determined",
      city: formData.goingTo || "Destination City",
      coordinates: [0, 0]
    },
    roomType: formData.hotelDetails?.roomType || "Standard",
    amenities: ["WiFi", "Air Conditioning", "Swimming Pool"],
    checkIn: checkIn,
    checkOut: checkOut,
    cancellationPolicy: ["Free cancellation up to 24 hours before check-in"]
  }];
};

const mapVisaData = (formData) => {
  return [{
    country: formData.visaDetails?.country || "To be determined",
    type: (formData.visaDetails?.type || "tourist").toLowerCase(),
    processingTime: formData.visaDetails?.processingTime || "7-10 business days",
    requirements: ["Passport copy", "Photographs", "Application form", "Travel itinerary"]
  }];
};

const mapPackageIncludes = (formData) => {
  const includes = formData.inclusions || [];
  return {
    flights: includes.includes('Flights'),
    hotels: includes.includes('Hotels'),
    visas: includes.includes('Visa Assistance'),
    meals: {
      breakfast: includes.includes('Meals'),
      lunch: includes.includes('Meals'),
      dinner: includes.includes('Meals')
    },
    transfers: includes.includes('Transfers'),
    activities: includes.includes('Sightseeing'),
    insurance: includes.includes('Insurance')
  };
};

const mapMealPlan = (formData) => {
  const mealPlan = formData.hotelDetails?.mealPlan;
  return {
    breakfast: mealPlan === 'breakfast' || mealPlan === 'half_board' || mealPlan === 'full_board' || mealPlan === 'all_inclusive',
    lunch: mealPlan === 'half_board' || mealPlan === 'full_board' || mealPlan === 'all_inclusive',
    dinner: mealPlan === 'full_board' || mealPlan === 'all_inclusive'
  };
};

const mapPricing = (formData, type) => {
  const basePrice = parseFloat(formData.expectedClosureAmount) || 1000;
  let components = {
    flights: 0,
    accommodation: 0,
    visas: 0,
    taxes: 0,
    fees: 0
  };

  switch (type) {
    case 'flight':
      components.flights = basePrice * 0.8;
      components.taxes = basePrice * 0.15;
      components.fees = basePrice * 0.05;
      break;
    case 'hotel':
      components.accommodation = basePrice * 0.85;
      components.taxes = basePrice * 0.12;
      components.fees = basePrice * 0.03;
      break;
    default: // package
      components.flights = basePrice * 0.4;
      components.accommodation = basePrice * 0.45;
      components.visas = basePrice * 0.05;
      components.taxes = basePrice * 0.08;
      components.fees = basePrice * 0.02;
      break;
  }

  const totalPrice = Object.values(components).reduce((sum, val) => sum + val, 0);

  return {
    basePrice: basePrice,
    components: components,
    discounts: {
      earlyBird: 0,
      group: 0,
      promoCode: ""
    },
    totalPrice: totalPrice,
    currency: "INR",
    paymentPlan: {
      depositRequired: true,
      depositAmount: totalPrice * 0.2,
      installmentOptions: [
        {
          percentage: 50,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  };
};

const calculateFlightDuration = (formData) => {
  const routeKey = `${formData.sourceCity}-${formData.destinationCity}`.toLowerCase();
  const durationMap = {
    'delhi-mumbai': 120,
    'mumbai-dubai': 180,
    'default': 150
  };
  return durationMap[routeKey] || durationMap.default;
};

// Additional controller functions
const getQueriesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    
    const queries = await Query.find({ leadId })
      .populate('leadId')
      .sort({ createdAt: -1 });

    res.json({
      message: "Queries retrieved successfully",
      queries,
      count: queries.length
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateQueryStatus = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { status } = req.body;

    const validStatuses = ["draft", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + validStatuses.join(", ")
      });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      queryId,
      { 
        onStatus: status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedQuery) {
      return res.status(404).json({ message: "Query not found" });
    }

    res.json({
      message: "Query status updated successfully",
      query: updatedQuery
    });
  } catch (error) {
    console.error("Error updating query status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createNewQuery,
  getQueriesByLead,
  updateQueryStatus
};