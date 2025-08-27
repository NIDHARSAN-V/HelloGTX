const express = require("express");
const router = express.Router();
const {
  createFlightPackage,
  getAllFlightPackages,
  getFlightPackagesBySearch,
  getFlightPackageById,
  updateFlightPackage,
  deleteFlightPackage,
} = require("../../Controllers/Flight/flightPackage.controller");

// Public routes
router.get("/", getAllFlightPackages);
router.get("/search", getFlightPackagesBySearch);
router.get("/:id", getFlightPackageById);

// Protected admin routes
router.post("/", createFlightPackage); 
router.put("/:id", updateFlightPackage);
router.delete("/:id", deleteFlightPackage);

module.exports = router;
