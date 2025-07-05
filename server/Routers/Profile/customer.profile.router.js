const express = require("express");
const CustomerProfileRouter = express.Router();
const {
  getProfile,
  saveProfile,
  clearProfile,
} = require("../../Controllers/CustomerProfile/customer.profile.controller");

const { validateSaveProfile } = require("../../Validators/Customer.profile.validator");

const { authMiddleware } = require("../../Controllers/Auth/auth.controller");




// Get profile
CustomerProfileRouter.get("/", authMiddleware, getProfile);

// Save/update profile
CustomerProfileRouter.post("/", authMiddleware, validateSaveProfile, saveProfile);

// Clear profile data
CustomerProfileRouter.delete("/", authMiddleware, clearProfile);

module.exports = CustomerProfileRouter;