const Query = require("../../Models/Query/queryPackage.model");
const Lead = require("../../Models/Leads/lead.model");

/**
 * Create a new Query from frontend data
 */
const createNewQuery = async (req, res) => {
  try {
    console.log("Request body in query controller:", req.body);

    const { 
      leadId, 
      customer, 
      employee, 
      onStatus = 'draft',
      package = {},
      dayWiseData = {},
      includes = {},
      pricing = {},
      expectedClosureDate,
      expectedClosureAmount,
      remarks 
    } = req.body;

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

    // Prepare query data according to frontend structure
    const queryData = {
      leadId,
      customer: {
        id: customer.id || customer._id,
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
        type: customer.type
      },
      employee: {
        id: employee.id || employee.employeeId || employee._id,
        email: employee.email,
        name: employee.name || 'Travel Consultant'
      },
      onStatus,
      package: {
        queryType: package.queryType || 'FIT',
        goingFrom: package.goingFrom,
        goingTo: package.goingTo,
        specificDate: package.specificDate ? new Date(package.specificDate) : undefined,
        noOfDays: package.noOfDays ? parseInt(package.noOfDays) : undefined,
        travellers: package.travellers ? parseInt(package.travellers) : 2,
        priceRange: package.priceRange,
        inclusions: package.inclusions || [],
        themes: package.themes || [],
        hotelPreference: package.hotelPreference || '3',
        foodPreferences: package.foodPreferences || [],
        remarks: package.remarks,
        expectedClosureDate: package.expectedClosureDate ? new Date(package.expectedClosureDate) : undefined,
        expectedClosureAmount: package.expectedClosureAmount ? parseFloat(package.expectedClosureAmount) : undefined,
        name: package.name,
        description: package.description,
        tags: package.tags || []
      },
      dayWiseData: {
        flights: (dayWiseData.flights || []).map(flight => ({
          ...flight,
          date: flight.date ? new Date(flight.date) : undefined,
          departure: flight.departure ? {
            ...flight.departure,
            datetime: flight.departure.datetime ? new Date(flight.departure.datetime) : undefined
          } : {},
          arrival: flight.arrival ? {
            ...flight.arrival,
            datetime: flight.arrival.datetime ? new Date(flight.arrival.datetime) : undefined
          } : {},
          price: flight.price ? parseFloat(flight.price) : undefined
        })),
        hotels: (dayWiseData.hotels || []).map(hotel => ({
          ...hotel,
          date: hotel.date ? new Date(hotel.date) : undefined,
          checkIn: hotel.checkIn ? new Date(hotel.checkIn) : undefined,
          checkOut: hotel.checkOut ? new Date(hotel.checkOut) : undefined,
          price: hotel.price ? parseFloat(hotel.price) : undefined
        })),
        transfers: (dayWiseData.transfers || []).map(transfer => ({
          ...transfer,
          date: transfer.date ? new Date(transfer.date) : undefined,
          price: transfer.price ? parseFloat(transfer.price) : undefined
        })),
        visas: (dayWiseData.visas || []).map(visa => ({
          ...visa,
          date: visa.date ? new Date(visa.date) : undefined,
          price: visa.price ? parseFloat(visa.price) : undefined
        })),
        sightseeing: (dayWiseData.sightseeing || []).map(activity => ({
          ...activity,
          date: activity.date ? new Date(activity.date) : undefined,
          price: activity.price ? parseFloat(activity.price) : undefined
        })),
        miscellaneous: (dayWiseData.miscellaneous || []).map(item => ({
          ...item,
          date: item.date ? new Date(item.date) : undefined,
          price: item.price ? parseFloat(item.price) : undefined
        })),
        companyFormation: (dayWiseData.companyFormation || []).map(company => ({
          ...company,
          date: company.date ? new Date(company.date) : undefined,
          expectedClosureDate: company.expectedClosureDate ? new Date(company.expectedClosureDate) : undefined,
          expectedClosureAmount: company.expectedClosureAmount ? parseFloat(company.expectedClosureAmount) : undefined,
          price: company.price ? parseFloat(company.price) : undefined
        })),
        forex: (dayWiseData.forex || []).map(forex => ({
          ...forex,
          date: forex.date ? new Date(forex.date) : undefined,
          deliveryDate: forex.deliveryDate ? new Date(forex.deliveryDate) : undefined,
          expectedClosureDate: forex.expectedClosureDate ? new Date(forex.expectedClosureDate) : undefined,
          expectedClosureAmount: forex.expectedClosureAmount ? parseFloat(forex.expectedClosureAmount) : undefined,
          price: forex.price ? parseFloat(forex.price) : undefined
        }))
      },
      includes: {
        flights: includes.flights || false,
        hotels: includes.hotels || false,
        visas: includes.visas || false,
        meals: includes.meals || {
          breakfast: false,
          lunch: false,
          dinner: false
        },
        transfers: includes.transfers || false,
        activities: includes.activities || false,
        insurance: includes.insurance || false
      },
      pricing: {
        basePrice: pricing.basePrice ? parseFloat(pricing.basePrice) : 0,
        components: pricing.components || {
          flights: 0,
          accommodation: 0,
          visas: 0,
          transfers: 0,
          activities: 0,
          taxes: 0,
          fees: 0
        },
        discounts: pricing.discounts || {
          earlyBird: 0,
          group: 0,
          promoCode: ''
        },
        totalPrice: pricing.totalPrice ? parseFloat(pricing.totalPrice) : 0,
        currency: pricing.currency || 'USD',
        paymentPlan: pricing.paymentPlan || {
          depositRequired: false,
          depositAmount: 0,
          installmentOptions: []
        }
      },
      expectedClosureDate: expectedClosureDate ? new Date(expectedClosureDate) : undefined,
      expectedClosureAmount: expectedClosureAmount ? parseFloat(expectedClosureAmount) : undefined,
      remarks
    };

    // Create and save the query
    const newQuery = new Query(queryData);
    const savedQuery = await newQuery.save();

    // Update lead with query reference
    await Lead.findByIdAndUpdate(leadId, {
      $push: { queryId: savedQuery._id },
      $set: { 
        status: "follow_up", 
        updatedAt: new Date() 
      },
      $push: {
        statusHistory: {
          status: "follow_up",
          changedBy: employee.id || employee._id,
          timestamp: new Date(),
          notes: `New query created: ${package.name || 'Untitled Query'}`,
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

    const queries = await Query.find({ leadId })
      .populate("leadId")
      .populate("dayWiseData.flights.selectedFlightPackage")
      .populate("dayWiseData.hotels.selectedHotelPackage")
      .sort({ createdAt: -1 });

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
 * Get single query by ID
 */
const getQueryById = async (req, res) => {
  try {
    const { queryId } = req.params;
    
    const query = await Query.findById(queryId)
      .populate("leadId")
      .populate("dayWiseData.flights.selectedFlightPackage")
      .populate("dayWiseData.hotels.selectedHotelPackage");

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    return res.json({
      message: "Query retrieved successfully",
      query,
    });
  } catch (error) {
    console.error("Error fetching query:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Edit an existing query
 */
const editQuery = async (req, res) => {
  try {
    console.log("Edit query request body:", req.body);
    const { queryId } = req.params;
    const { 
      leadId, 
      customer, 
      employee, 
      onStatus,
      package = {},
      dayWiseData = {},
      includes = {},
      pricing = {},
      expectedClosureDate,
      expectedClosureAmount,
      remarks 
    } = req.body;

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

    // Prepare update data
    const updateData = {
      customer: {
        id: customer.id || customer._id,
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
        type: customer.type
      },
      employee: {
        id: employee.id || employee.employeeId || employee._id,
        email: employee.email,
        name: employee.name || 'Travel Consultant'
      },
      onStatus: onStatus || existingQuery.onStatus,
      package: {
        queryType: package.queryType || existingQuery.package.queryType,
        goingFrom: package.goingFrom || existingQuery.package.goingFrom,
        goingTo: package.goingTo || existingQuery.package.goingTo,
        specificDate: package.specificDate ? new Date(package.specificDate) : existingQuery.package.specificDate,
        noOfDays: package.noOfDays ? parseInt(package.noOfDays) : existingQuery.package.noOfDays,
        travellers: package.travellers ? parseInt(package.travellers) : existingQuery.package.travellers,
        priceRange: package.priceRange || existingQuery.package.priceRange,
        inclusions: package.inclusions || existingQuery.package.inclusions,
        themes: package.themes || existingQuery.package.themes,
        hotelPreference: package.hotelPreference || existingQuery.package.hotelPreference,
        foodPreferences: package.foodPreferences || existingQuery.package.foodPreferences,
        remarks: package.remarks || existingQuery.package.remarks,
        expectedClosureDate: package.expectedClosureDate ? new Date(package.expectedClosureDate) : existingQuery.package.expectedClosureDate,
        expectedClosureAmount: package.expectedClosureAmount ? parseFloat(package.expectedClosureAmount) : existingQuery.package.expectedClosureAmount,
        name: package.name || existingQuery.package.name,
        description: package.description || existingQuery.package.description,
        tags: package.tags || existingQuery.package.tags
      },
      dayWiseData: {
        flights: (dayWiseData.flights || existingQuery.dayWiseData.flights).map(flight => ({
          ...flight,
          date: flight.date ? new Date(flight.date) : undefined,
          departure: flight.departure ? {
            ...flight.departure,
            datetime: flight.departure.datetime ? new Date(flight.departure.datetime) : undefined
          } : {},
          arrival: flight.arrival ? {
            ...flight.arrival,
            datetime: flight.arrival.datetime ? new Date(flight.arrival.datetime) : undefined
          } : {},
          price: flight.price ? parseFloat(flight.price) : undefined
        })),
        hotels: (dayWiseData.hotels || existingQuery.dayWiseData.hotels).map(hotel => ({
          ...hotel,
          date: hotel.date ? new Date(hotel.date) : undefined,
          checkIn: hotel.checkIn ? new Date(hotel.checkIn) : undefined,
          checkOut: hotel.checkOut ? new Date(hotel.checkOut) : undefined,
          price: hotel.price ? parseFloat(hotel.price) : undefined
        })),
        // ... similar mapping for other categories
      },
      includes: includes || existingQuery.includes,
      pricing: pricing || existingQuery.pricing,
      expectedClosureDate: expectedClosureDate ? new Date(expectedClosureDate) : existingQuery.expectedClosureDate,
      expectedClosureAmount: expectedClosureAmount ? parseFloat(expectedClosureAmount) : existingQuery.expectedClosureAmount,
      remarks: remarks || existingQuery.remarks,
      updatedAt: new Date()
    };



    const updatedQuery = await Query.findByIdAndUpdate(
      queryId, 
      updateData, 
      { new: true, runValidators: true }
    );

    // Update lead timestamp
    await Lead.findByIdAndUpdate(leadId, { 
      $set: { updatedAt: new Date() },
      $push: {
        statusHistory: {
          status: "follow_up",
          changedBy: employee.id || employee._id,
          timestamp: new Date(),
          notes: `Query updated: ${package.name || existingQuery.package.name}`,
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

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Update query status
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
      { 
        onStatus: status, 
        updatedAt: new Date() 
      },
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

/**
 * Delete a query
 */
const deleteQuery = async (req, res) => {
  try {
    const { queryId } = req.params;

    const deletedQuery = await Query.findByIdAndDelete(queryId);

    if (!deletedQuery) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Remove query reference from lead
    await Lead.findByIdAndUpdate(deletedQuery.leadId, {
      $pull: { queryId: deletedQuery._id }
    });

    return res.json({
      message: "Query deleted successfully",
      query: deletedQuery,
    });
  } catch (error) {
    console.error("Error deleting query:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createNewQuery,
  getQueriesByLead,
  getQueryById,
  editQuery,
  updateQueryStatus,
  deleteQuery,
};