const FlightPackage = require("../../Models/BookingsAndPackage/flightPackage.model");

// @desc    Create a new flight package
// @route   POST /api/flight-packages
// @access  Private/Admin
const createFlightPackage = async (req, res) => {
  try {
    const flightData = req.body;

    // Calculate duration if not provided
    if (
      !flightData.duration &&
      flightData.departure.datetime &&
      flightData.arrival.datetime
    ) {
      const diffMs =
        new Date(flightData.arrival.datetime) -
        new Date(flightData.departure.datetime);
      flightData.duration = Math.floor(diffMs / (1000 * 60));
    }

    const newFlight = new FlightPackage(flightData);
    const savedFlight = await newFlight.save();

    res.status(201).json(savedFlight);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const getAllFlightPackages = async (req, res) => {
  try {
    const flightPackages = await FlightPackage.find();
    if (!flightPackages || flightPackages.length === 0) {
      return res.status(404).json({ message: "No flight packages found" });
    }
    res.status(200).json(flightPackages);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get all flight packages
// @route   GET /api/flight-packages
// @access  Public
const getFlightPackagesBySearch = async (req, res) => {
  try {
    const { status, departureCity, arrivalCity, minPrice, maxPrice, sort } =
      req.query;

    const filter = {};
    if (status) filter.status = status;
    if (departureCity)
      filter["departure.city"] = new RegExp(departureCity, "i");
    if (arrivalCity) filter["arrival.city"] = new RegExp(arrivalCity, "i");
    if (minPrice || maxPrice) {
      filter.totalPrice = {};
      if (minPrice) filter.totalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.totalPrice.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { totalPrice: 1 };
    if (sort === "price_desc") sortOption = { totalPrice: -1 };
    if (sort === "duration") sortOption = { duration: 1 };

    const flights = await FlightPackage.find(filter).sort(sortOption);
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get single flight package
// @route   GET /api/flight-packages/:id
// @access  Public
const getFlightPackageById = async (req, res) => {
  try {
    const flight = await FlightPackage.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: "Flight package not found" });
    }
    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Update flight package
// @route   PUT /api/flight-packages/:id
// @access  Private/Admin
const updateFlightPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Recalculate duration if departure or arrival datetime changed
    if (
      (updateData.departure?.datetime || updateData.arrival?.datetime) &&
      !updateData.duration
    ) {
      const existingFlight = await FlightPackage.findById(id);
      const departure =
        updateData.departure?.datetime || existingFlight.departure.datetime;
      const arrival =
        updateData.arrival?.datetime || existingFlight.arrival.datetime;
      const diffMs = new Date(arrival) - new Date(departure);
      updateData.duration = Math.floor(diffMs / (1000 * 60));
    }

    const updatedFlight = await FlightPackage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFlight) {
      return res.status(404).json({ message: "Flight package not found" });
    }

    res.status(200).json(updatedFlight);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Delete flight package
// @route   DELETE /api/flight-packages/:id
// @access  Private/Admin
const deleteFlightPackage = async (req, res) => {
  try {
    const deletedFlight = await FlightPackage.findByIdAndDelete(req.params.id);
    if (!deletedFlight) {
      return res.status(404).json({ message: "Flight package not found" });
    }
    res.status(200).json({ message: "Flight package deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = {
  createFlightPackage,
  getAllFlightPackages,
  getFlightPackagesBySearch,
  getFlightPackageById,
  updateFlightPackage,
  deleteFlightPackage,
};
