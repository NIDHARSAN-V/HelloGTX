const HotelPackage = require("../../Models/BookingsAndPackage/hotelPackage.model");
const mongoose = require("mongoose");

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// @desc    Create a new hotel package
// @route   POST /api/hotel-packages
// @access  Private/Admin
const createHotelPackage = async (req, res) => {
  try {
    const packageData = req.body;

    // Generate slug if not provided
    if (!packageData.slug) {
      packageData.slug = generateSlug(packageData.name);
    }

    // Auto-calculate nights if not provided
    if (!packageData.nights && packageData.checkIn && packageData.checkOut) {
      const diffTime = Math.abs(
        new Date(packageData.checkOut) - new Date(packageData.checkIn)
      );
      packageData.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const newPackage = new HotelPackage(packageData);
    const savedPackage = await newPackage.save();

    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get all hotel packages
// @route   GET /api/hotel-packages
// @access  Public

const getAllHotelPackages = async (req, res) => {
  try {
    const hotelPackages = await HotelPackage.find();
    if (!hotelPackages || hotelPackages.length === 0) {
      return res.status(404).json({ message: "No hotel packages found" });
    }
    res.status(200).json(hotelPackages);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get all hotel packages
// @route   GET /api/hotel-packages
// @access  Public

const getHotelPackagesBySearch = async (req, res) => {
  try {
    const { status, city, country, minPrice, maxPrice, sort } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (country) filter["location.country"] = new RegExp(country, "i");
    if (minPrice || maxPrice) {
      filter.totalPrice = {};
      if (minPrice) filter.totalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.totalPrice.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { totalPrice: 1 };
    if (sort === "price_desc") sortOption = { totalPrice: -1 };
    if (sort === "rating") sortOption = { starRating: -1 };

    const packages = await HotelPackage.find(filter).sort(sortOption);
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get single hotel package
// @route   GET /api/hotel-packages/:id
// @access  Public
const getHotelPackageById = async (req, res) => {
  try {
    const package = await HotelPackage.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: "Hotel package not found" });
    }
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Update hotel package
// @route   PUT /api/hotel-packages/:id
// @access  Private/Admin
const updateHotelPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Recalculate nights if checkIn or checkOut changed
    if ((updateData.checkIn || updateData.checkOut) && !updateData.nights) {
      const existingPackage = await HotelPackage.findById(id);
      const checkIn = updateData.checkIn
        ? new Date(updateData.checkIn)
        : existingPackage.checkIn;
      const checkOut = updateData.checkOut
        ? new Date(updateData.checkOut)
        : existingPackage.checkOut;
      const diffTime = Math.abs(checkOut - checkIn);
      updateData.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const updatedPackage = await HotelPackage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: "Hotel package not found" });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Delete hotel package
// @route   DELETE /api/hotel-packages/:id
// @access  Private/Admin
const deleteHotelPackage = async (req, res) => {
  try {
    const deletedPackage = await HotelPackage.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).json({ message: "Hotel package not found" });
    }
    res.status(200).json({ message: "Hotel package deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = {
  createHotelPackage,
  getAllHotelPackages,
  getHotelPackagesBySearch,
  getHotelPackageById,
  updateHotelPackage,
  deleteHotelPackage,
};
