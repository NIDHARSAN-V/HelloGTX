const Package = require("../../Models/BookingsAndPackage/package.model");
const mongoose = require("mongoose");

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = async (req, res) => {
  try {
    const packageData = req.body;

    // Generate slug if not provided
    if (!packageData.slug) {
      packageData.slug = generateSlug(packageData.name);
    }

    // Auto-calculate total price if not provided
    if (!packageData.pricing?.totalPrice) {
      packageData.pricing = packageData.pricing || {};
      packageData.pricing.totalPrice = calculateTotalPrice(packageData.pricing);
    }

    const newPackage = new Package(packageData);
    const savedPackage = await newPackage.save();

    res.status(201).json(savedPackage); // Changed to return just the package for Redux
  } catch (error) {
    res.status(400).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get all packages with filtering
// @route   GET /api/packages
// @access  Public
const getAllPackages = async (req, res) => {
  try {
    const { tag, q: searchQuery } = req.query;
    let query = {};

    // Filter by tag if provided
    if (tag) {
      query.tags = tag;
    }

    // Search by name or description if search query provided
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const packages = await Package.find(query);
    res.json(packages); // Return array of packages directly for Redux
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid package ID" });
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json(package); // Return package directly for Redux
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid package ID" });
    }

    const updateData = req.body;

    // Update slug if name changed
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    // Recalculate total price if pricing components changed
    if (updateData.pricing) {
      updateData.pricing.totalPrice = calculateTotalPrice({
        ...updateData.pricing,
        ...(updateData.pricing.discounts || {}),
      });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.json(updatedPackage); // Return updated package directly for Redux
  } catch (error) {
    res.status(400).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid package ID" });
    }

    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json({ _id: deletedPackage._id }); // Return just ID for Redux
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Helper function to calculate total price
const calculateTotalPrice = (pricing) => {
  const base = pricing.basePrice || 0;
  const flights = pricing.components?.flights || 0;
  const accommodation = pricing.components?.accommodation || 0;
  const visas = pricing.components?.visas || 0;
  const taxes = pricing.components?.taxes || 0;
  const fees = pricing.components?.fees || 0;
  const earlyBird = pricing.discounts?.earlyBird || 0;
  const group = pricing.discounts?.group || 0;

  return (
    base + flights + accommodation + visas + taxes + fees - earlyBird - group
  );
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
