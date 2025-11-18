// controllers/query.controller.js
const Query = require("../../Models/Query/queryPackage.model");
const Lead = require("../../Models/Leads/lead.model");

/**
 * Create a new Query (supports day-wise itinerary)
 */
const createNewQuery = async (req, res) => {
  try {
    console.log(req.body, "Request body in query controller");

    const { formData = {}, leadId, customer, employee } = req.body;

    // Validate required fields
    if (!leadId || !customer || !employee) {
      return res.status(400).json({
        message: "Missing required fields: leadId, customer, or employee",
      });
    }

    // Check if lead exists
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Map form data to Query schema structure (supports itinerary)
    const queryData = mapFormDataToQuerySchema(formData, leadId, customer, employee);

    // Create and save
    const newQuery = new Query(queryData);
    const savedQuery = await newQuery.save();

    // Update lead with query reference and status
    await Lead.findByIdAndUpdate(leadId, {
      $push: { queryId: savedQuery._id },
      $set: { status: "follow_up", updatedAt: new Date() },
      $push: {
        statusHistory: {
          status: "follow_up",
          changedBy: employee.id || employee._id,
          timestamp: new Date(),
          notes: `New query created: ${queryData.name}`,
        },
      },
    });

    console.log("Query created successfully:", savedQuery._id);

    return res.status(201).json({
      message: "Query created successfully",
      query: savedQuery,
      leadUpdated: true,
    });
  } catch (error) {
    console.error("Error creating query:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry found",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get all queries for a lead
 */
const getQueriesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    if (!leadId) return res.status(400).json({ message: "leadId is required" });

    const queries = await Query.find({ leadId }).populate("leadId").sort({ createdAt: -1 });

    console.log("Queries fetched for lead:", leadId, queries?.length);

    return res.json({
      message: "Queries retrieved successfully",
      queries,
      count: queries.length,
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Edit an existing query (replaces itinerary if provided)
 */
const editQuery = async (req, res) => {
  try {
    console.log("Edit query request body:", req.body);
    const { queryId } = req.params;
    const { formData = {}, leadId, customer, employee } = req.body;

    if (!queryId || !leadId || !customer || !employee) {
      return res.status(400).json({
        message: "Missing required fields: queryId, leadId, customer, or employee",
      });
    }

    const existingQuery = await Query.findById(queryId);
    if (!existingQuery) {
      return res.status(404).json({ message: "Query not found" });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Map incoming form data to query data
    const updatedQueryData = mapFormDataToQuerySchema(formData, leadId, customer, employee);

    // Preserve original creation meta & slug & _id
    updatedQueryData.createdAt = existingQuery.createdAt;
    updatedQueryData.updatedAt = new Date();
    updatedQueryData._id = existingQuery._id;
    updatedQueryData.slug = existingQuery.slug;

    // Run update with validators
    const updatedQuery = await Query.findByIdAndUpdate(queryId, updatedQueryData, {
      new: true,
      runValidators: true,
    });

    // Update lead timestamp and push status history
    await Lead.findByIdAndUpdate(leadId, { $set: { updatedAt: new Date() } });
    await Lead.findByIdAndUpdate(leadId, {
      $push: {
        statusHistory: {
          status: "follow_up",
          changedBy: employee.id || employee._id,
          timestamp: new Date(),
          notes: `Query updated: ${updatedQueryData.name}`,
        },
      },
    });

    console.log("Query updated successfully:", updatedQuery._id);

    return res.status(200).json({
      message: "Query updated successfully",
      query: updatedQuery,
      leadUpdated: true,
    });
  } catch (error) {
    console.error("Error editing query:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry found",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Update query status (onStatus)
 */
const updateQueryStatus = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { status } = req.body;

    const validStatuses = ["draft", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      queryId,
      { onStatus: status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedQuery) {
      return res.status(404).json({ message: "Query not found" });
    }

    return res.json({
      message: "Query status updated successfully",
      query: updatedQuery,
    });
  } catch (error) {
    console.error("Error updating query status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* -----------------------
   MAPPING / HELPER LOGIC
   ----------------------- */

/**
 * Top-level mapper:
 * - If formData.itinerary (array) provided, map it directly
 * - Otherwise build a simple single-day itinerary from legacy fields
 */
const mapFormDataToQuerySchema = (formData, leadId, customer, employee) => {
  const customerName = `${customer.user?.firstName || ""} ${customer.user?.lastName || ""}`.trim() || "Customer";
  const currentDate = new Date();

  // Determine query type
  const queryType = determineQueryType(formData);

  // Ensure tags / themes
  const validTags = ["family", "honeymoon", "adventure", "luxury", "budget"];
  const filteredThemes = (formData.themes || []).map((t) => String(t).toLowerCase()).filter((t) => validTags.includes(t));
  const finalTags = filteredThemes.length > 0 ? filteredThemes : ["custom"];

  const baseQuery = {
    leadId,
    onStatus: "draft",
    name: `${customerName} - ${queryType} Package - ${currentDate.toLocaleDateString()}`,
    description: generateDescription(formData, queryType, customerName),
    slug: generateSlug(customerName, queryType, currentDate),
    images: {
      mainImage: formData.mainImage || "https://via.placeholder.com/800x600?text=Travel+Package",
      gallery: formData.gallery || [],
    },
    tags: finalTags,
    offStatus: formData.offStatus || "active",
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  // Pricing mapping
  const pricing = mapPricing(formData, queryType.toLowerCase());
  baseQuery.pricing = pricing;

  // Includes mapping (package includes)
  baseQuery.includes = mapPackageIncludes(formData);

  // Itinerary mapping
  if (Array.isArray(formData.itinerary) && formData.itinerary.length > 0) {
    baseQuery.itinerary = mapItinerary(formData.itinerary);
  } else {
    // Fallback: create a single-day itinerary from legacy fields
    baseQuery.itinerary = [mapDayFromLegacyFields(formData)];
  }

  // Add cancellationPolicy, terms, etc if provided
  if (formData.cancellationPolicy) baseQuery.cancellationPolicy = formData.cancellationPolicy;
  if (formData.termsConditions) baseQuery.termsConditions = formData.termsConditions;

  return baseQuery;
};

/**
 * Map an array of day objects sent from frontend to the itinerary schema
 * Expected day object keys (flexible):
 *  - day (Number)
 *  - date (Date|string)
 *  - flights: [...]
 *  - hotels: [...]
 *  - visas: [...]
 *  - sightseeing: [...]
 */
const mapItinerary = (daysArray) => {
  const mapped = daysArray.map((dayItem, idx) => {
    // Ensure numeric day property; fallback to index+1
    const dayNumber = typeof dayItem.day === "number" ? dayItem.day : idx + 1;
    return mapDay(dayNumber, dayItem);
  });
  return mapped;
};

/**
 * Map a single day's front-end object into the schema shape
 */
const mapDay = (dayNumber, dayItem = {}) => {
  const day = {
    day: dayNumber,
    flights: [],
    hotels: [],
    visas: [],
    sightseeing: [],
  };

  // Flights: either already in the correct shape or map minimal fields
  if (Array.isArray(dayItem.flights) && dayItem.flights.length > 0) {
    day.flights = dayItem.flights.map((f) => mapFlightForDay(f));
  } else if (dayItem.flight) {
    // single flight object
    day.flights = [mapFlightForDay(dayItem.flight)];
  }

  // Hotels
  if (Array.isArray(dayItem.hotels) && dayItem.hotels.length > 0) {
    day.hotels = dayItem.hotels.map((h) => mapHotelForDay(h));
  } else if (dayItem.hotel) {
    day.hotels = [mapHotelForDay(dayItem.hotel)];
  }

  // Visas
  if (Array.isArray(dayItem.visas) && dayItem.visas.length > 0) {
    day.visas = dayItem.visas.map((v) => mapVisaForDay(v));
  } else if (dayItem.visa) {
    day.visas = [mapVisaForDay(dayItem.visa)];
  }

  // Sightseeing / Activities
  if (Array.isArray(dayItem.sightseeing) && dayItem.sightseeing.length > 0) {
    day.sightseeing = dayItem.sightseeing.map((s) => mapSightseeingForDay(s));
  } else if (Array.isArray(dayItem.activities) && dayItem.activities.length > 0) {
    // accept alternate name activities
    day.sightseeing = dayItem.activities.map((s) => mapSightseeingForDay(s));
  } else if (dayItem.sight) {
    day.sightseeing = [mapSightseeingForDay(dayItem.sight)];
  }

  return day;
};

/**
 * When frontend didn't send itinerary, create a simple single day using legacy fields
 */
const mapDayFromLegacyFields = (formData) => {
  const day = {
    day: 1,
    flights: [],
    hotels: [],
    visas: [],
    sightseeing: [],
  };

  // Map flight from top-level fields if present
  if (formData.sourceCity || formData.destinationCity || formData.departureDate || formData.returnDate) {
    day.flights = [
      mapFlightForDay({
        airline: formData.preferredAirline,
        flightNumber: formData.flightNumber,
        departure: {
          airport: formData.sourceCity || formData.goingFrom || "To be determined",
          datetime: formData.departureDate ? new Date(formData.departureDate) : undefined,
          city: formData.sourceCity || formData.goingFrom || "To be determined",
        },
        arrival: {
          airport: formData.destinationCity || formData.goingTo || "To be determined",
          datetime: formData.returnDate ? new Date(formData.returnDate) : undefined,
          city: formData.destinationCity || formData.goingTo || "To be determined",
        },
        cabinClass: formData.flightClass,
      }),
    ];
  }

  // Map hotel (legacy hotelDetails)
  if (formData.hotelDetails || formData.goingTo) {
    day.hotels = [
      mapHotelForDay({
        name: `Selected Hotel - ${formData.goingTo || "Destination"}`,
        starRating: formData.hotelPreference,
        location: { city: formData.goingTo || "Destination City", address: formData.hotelDetails?.address || "" },
        roomType: formData.hotelDetails?.roomType,
        checkIn: formData.hotelDetails?.checkIn,
        checkOut: formData.hotelDetails?.checkOut,
      }),
    ];
  }

  // Map visa (legacy)
  if (formData.visaDetails) {
    day.visas = [mapVisaForDay(formData.visaDetails)];
  }

  // Map sightseeing/activities (legacy)
  if (formData.activities && Array.isArray(formData.activities)) {
    day.sightseeing = formData.activities.map((a) => mapSightseeingForDay(a));
  } else if (formData.activity) {
    day.sightseeing = [mapSightseeingForDay(formData.activity)];
  }

  return day;
};

/* ---------- Day-level mappers ---------- */

const mapFlightForDay = (f = {}) => {
  // Normalize minimal flight object to the schema format; fill defaults where useful
  const departure = (f.departure && typeof f.departure === "object") ? f.departure : {
    airport: f.departureAirport || f.departure?.airport || f.sourceCity || "To be determined",
    terminal: f.departure?.terminal || "TBD",
    datetime: f.departure?.datetime ? new Date(f.departure.datetime) : (f.departureDate ? new Date(f.departureDate) : undefined),
    city: f.departure?.city || f.sourceCity || f.goingFrom || "To be determined",
  };

  const arrival = (f.arrival && typeof f.arrival === "object") ? f.arrival : {
    airport: f.arrivalAirport || f.arrival?.airport || f.destinationCity || "To be determined",
    terminal: f.arrival?.terminal || "TBD",
    datetime: f.arrival?.datetime ? new Date(f.arrival.datetime) : (f.returnDate ? new Date(f.returnDate) : undefined),
    city: f.arrival?.city || f.destinationCity || f.goingTo || "To be determined",
  };

  const flight = {
    airline: f.airline || f.preferredAirline || "To be determined",
    flightNumber: f.flightNumber || f.number || `TBD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    departure,
    arrival,
    duration: f.duration || calculateFlightDuration({ departureDate: departure.datetime, returnDate: arrival.datetime, sourceCity: departure.city, destinationCity: arrival.city }),
    cabinClass: (f.cabinClass || f.flightClass || "economy").toLowerCase(),
    baggage: f.baggage || {
      carryOn: { allowed: true, weight: 7, dimensions: "55x40x20 cm" },
      checked: { allowed: true, pieces: 1, weight: 20 },
    },
    refundable: typeof f.refundable === "boolean" ? f.refundable : false,
  };

  // Ensure departure and arrival datetimes exist in the schema if present
  if (!flight.departure.datetime) delete flight.departure.datetime;
  if (!flight.arrival.datetime) delete flight.arrival.datetime;

  return flight;
};

const mapHotelForDay = (h = {}) => {
  return {
    name: h.name || `Selected Hotel - ${h.location?.city || h.city || "Destination"}`,
    starRating: parseInt(h.starRating || h.star || h.hotelPreference) || 3,
    location: {
      address: h.location?.address || h.address || "To be determined",
      city: h.location?.city || h.city || h.destination || "Destination City",
      coordinates: Array.isArray(h.location?.coordinates) ? h.location.coordinates : [0, 0],
    },
    roomType: h.roomType || h.room || "Standard",
    amenities: h.amenities || ["WiFi", "Air Conditioning"],
    checkIn: h.checkIn ? new Date(h.checkIn) : undefined,
    checkOut: h.checkOut ? new Date(h.checkOut) : undefined,
    cancellationPolicy: h.cancellationPolicy || ["Free cancellation up to 24 hours before check-in"],
  };
};

const mapVisaForDay = (v = {}) => {
  return {
    country: v.country || v.visaCountry || "To be determined",
    type: (v.type || v.visaType || "tourist").toLowerCase(),
    processingTime: v.processingTime || v.processing || "7-10 business days",
    requirements: v.requirements || v.docs || ["Passport copy", "Photographs", "Application form", "Travel itinerary"],
  };
};

const mapSightseeingForDay = (s = {}) => {
  return {
    title: s.title || s.name || "Sightseeing / Activity",
    description: s.description || s.desc || "",
    location: s.location || s.place || "",
    startTime: s.startTime ? new Date(s.startTime) : undefined,
    endTime: s.endTime ? new Date(s.endTime) : undefined,
    includes: s.includes || s.inclusions || [],
    images: s.images || [],
  };
};

/* ---------- Utility helpers ---------- */

const determineQueryType = (formData) => {
  // Favor explicit itinerary or inclusions
  if (Array.isArray(formData.itinerary) && formData.itinerary.length > 0) return "Package";
  if (formData.inclusions && Array.isArray(formData.inclusions) && formData.inclusions.length > 1) return "Package";
  if (formData.flightSelectionType || (formData.sourceCity && formData.destinationCity)) return "Flight";
  if (formData.hotelSelectionType || formData.goingTo || formData.hotelDetails) return "Hotel";
  if (formData.transferDetails?.pickup) return "Transfer";
  if (formData.visaDetails?.country) return "Visa";
  return "Custom";
};

const generateDescription = (formData, queryType, customerName) => {
  let description = `Custom ${queryType.toLowerCase()} package for ${customerName}`;

  if (formData.goingFrom && formData.goingTo) description += ` from ${formData.goingFrom} to ${formData.goingTo}`;
  if (formData.noOfDays) description += ` for ${formData.noOfDays} days`;
  if (formData.travellers) description += ` with ${formData.travellers} travellers`;
  if (formData.remarks) description += `\n\nSpecial Requirements: ${formData.remarks}`;

  // If short, append a default sentence to satisfy minlength
  if (description.length < 50) {
    description += ". This custom travel package includes all requested services and accommodations tailored to your preferences.";
  }

  return description;
};

const generateSlug = (customerName, queryType, date) => {
  const baseSlug = `${customerName.toLowerCase().replace(/\s+/g, "-")}-${queryType.toLowerCase()}-${date.getTime()}`;
  return baseSlug.substring(0, 100);
};

const mapPackageIncludes = (formData) => {
  const inclusions = formData.inclusions || formData.includes || [];
  return {
    flights: inclusions.includes("Flights") || inclusions.includes("flights"),
    hotels: inclusions.includes("Hotels") || inclusions.includes("hotels"),
    visas: inclusions.includes("Visa Assistance") || inclusions.includes("visas") || inclusions.includes("Visa"),
    meals: {
      breakfast: inclusions.includes("Meals") || inclusions.includes("meals") || inclusions.includes("Breakfast"),
      lunch: inclusions.includes("Meals") || inclusions.includes("meals"),
      dinner: inclusions.includes("Meals") || inclusions.includes("meals"),
    },
    transfers: inclusions.includes("Transfers"),
    activities: inclusions.includes("Sightseeing") || inclusions.includes("Activities"),
    insurance: inclusions.includes("Insurance"),
  };
};

const mapPricing = (formData, type) => {
  const basePrice = parseFloat(formData.expectedClosureAmount) || parseFloat(formData.basePrice) || 1000;
  let components = {
    flights: 0,
    accommodation: 0,
    visas: 0,
    taxes: 0,
    fees: 0,
  };

  switch (type) {
    case "flight":
      components.flights = basePrice * 0.8;
      components.taxes = basePrice * 0.15;
      components.fees = basePrice * 0.05;
      break;
    case "hotel":
      components.accommodation = basePrice * 0.85;
      components.taxes = basePrice * 0.12;
      components.fees = basePrice * 0.03;
      break;
    default:
      components.flights = basePrice * 0.4;
      components.accommodation = basePrice * 0.45;
      components.visas = basePrice * 0.05;
      components.taxes = basePrice * 0.08;
      components.fees = basePrice * 0.02;
      break;
  }

  const totalPrice = Object.values(components).reduce((sum, val) => sum + val, 0);

  return {
    basePrice,
    components,
    discounts: {
      earlyBird: 0,
      group: 0,
      promoCode: "",
    },
    totalPrice,
    currency: formData.currency || "INR",
    paymentPlan: {
      depositRequired: formData.depositRequired !== undefined ? formData.depositRequired : true,
      depositAmount: totalPrice * 0.2,
      installmentOptions: [
        {
          percentage: 50,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
    },
  };
};

const calculateFlightDuration = (formData) => {
  try {
    if (formData.departureDate && formData.returnDate) {
      const depDate = new Date(formData.departureDate);
      const arrDate = new Date(formData.returnDate);
      return Math.round((arrDate - depDate) / (1000 * 60)); // minutes
    }

    const routeKey = `${(formData.sourceCity || formData.goingFrom || "").toString().toLowerCase()}-${(formData.destinationCity || formData.goingTo || "").toString().toLowerCase()}`;
    const durationMap = {
      "delhi-mumbai": 120,
      "mumbai-dubai": 180,
      default: 150,
    };
    return durationMap[routeKey] || durationMap.default;
  } catch (err) {
    console.error("Error calculating flight duration:", err);
    return 150;
  }
};

/* Export module */
module.exports = {
  createNewQuery,
  getQueriesByLead,
  editQuery,
  updateQueryStatus,
};
