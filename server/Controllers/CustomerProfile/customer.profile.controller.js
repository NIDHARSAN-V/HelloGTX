const Customer = require("../../Models/Auth/Users/customer.model");
const User = require("../../Models/Auth/user.model");
const { validationResult } = require("express-validator");

/**
 * @desc Get customer profile
 * @route GET /api/profile
 * @access Private (Customer only)
 */
const getProfile = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only customers can view this profile.",
      });
    }

    const customer = await Customer.findById(user.customerRef).populate(
      "bookings.packageId travelHistory.packageId"
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please complete your profile.",
      });
    }

    // Combine user and customer data
    const profileData = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        alternatePhone: user.alternatePhone,
        dateOfBirth: user.dateOfBirth,
      },
      customer: {
        address: customer.address,
        passport: customer.passport,
        nationality: customer.nationality,
        preferredDestinations: customer.preferredDestinations,
        travelHistory: customer.travelHistory,
        inquiries: customer.inquiries,
        bookings: customer.bookings,
        notes: customer.notes,
      },
    };

    res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile.",
    });
  }
};

/**
 * @desc Save or update customer profile
 * @route POST /api/profile
 * @access Private (Customer only)
 */
const saveProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const user = req.user;

    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only customers can update this profile.",
      });
    }

    const {
      firstName,
      lastName,
      phone,
      alternatePhone,
      dateOfBirth,
      address,
      passport,
      nationality,
      preferredDestinations,
    } = req.body;

    // Update user data
    const userUpdates = {};
    if (firstName) userUpdates.firstName = firstName;
    if (lastName) userUpdates.lastName = lastName;
    if (phone) userUpdates.phone = phone;
    if (alternatePhone) userUpdates.alternatePhone = alternatePhone;
    if (dateOfBirth) userUpdates.dateOfBirth = dateOfBirth;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(user._id, userUpdates, { new: true });
    }

    // Update or create customer data
    const customerUpdates = {
      address: address || {},
      passport: passport || {},
      nationality,
      preferredDestinations: preferredDestinations || [],
    };

    // Clean up undefined fields
    if (customerUpdates.passport) {
      Object.keys(customerUpdates.passport).forEach(
        (key) =>
          customerUpdates.passport[key] === undefined &&
          delete customerUpdates.passport[key]
      );
    }

    if (customerUpdates.address) {
      Object.keys(customerUpdates.address).forEach(
        (key) =>
          customerUpdates.address[key] === undefined &&
          delete customerUpdates.address[key]
      );
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: user.customerRef },
      customerUpdates,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving profile.",
    });
  }
};

/**
 * @desc Clear customer profile data
 * @route DELETE /api/profile
 * @access Private (Customer only)
 */
const clearProfile = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only customers can clear this profile.",
      });
    }

    const clearedCustomer = await Customer.findByIdAndUpdate(
      user.customerRef,
      {
        $set: {
          address: {},
          passport: {
            passportNumber: "",
            countryOfIssue: "",
            dateOfIssue: null,
            dateOfExpiry: null,
            placeOfIssue: "",
            nationality: "",
            documentImage: "",
            isVerified: false,
          },
          nationality: "",
          preferredDestinations: [],
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile data cleared successfully",
      data: clearedCustomer,
    });
  } catch (error) {
    console.error("Error clearing profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while clearing profile.",
    });
  }
};

module.exports = {
  getProfile,
  saveProfile,
  clearProfile,
};