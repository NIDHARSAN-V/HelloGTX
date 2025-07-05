const express = require('express');
const router = express.Router();

const {
  createPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage
} = require('../../Controllers/Packages/package.controller');

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private/Admin
router.post('/', createPackage);

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
router.get('/', getAllPackages);

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Public
router.get('/:id', getPackageById);

// @desc    Update a package
// @route   PUT /api/packages/:id
router.put('/:id', updatePackage);

// @desc    Delete a package
// @route   DELETE /api/packages/:id
router.delete('/:id', deletePackage);

module.exports = router;