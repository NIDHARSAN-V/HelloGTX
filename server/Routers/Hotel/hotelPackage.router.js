const express = require("express");
const router = express.Router();
const {
  createHotelPackage,
  getAllHotelPackages,
  getHotelPackagesBySearch,
  getHotelPackageById,
  updateHotelPackage,
  deleteHotelPackage,
} = require("../../Controllers/Hotel/hotelPackage.controller");

// Public routes
router.get("/", getAllHotelPackages);
router.get("/search", getHotelPackagesBySearch);
router.get("/:id", getHotelPackageById);

// Protected admin routes
router.post("/", createHotelPackage);
router.put("/:id", updateHotelPackage);
router.delete("/:id", deleteHotelPackage);

module.exports = router;
