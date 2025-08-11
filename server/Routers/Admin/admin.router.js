const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUserRole,
  updateUser,
  deleteUser,
} = require("../../Controllers/Admin/admin.controller");


const { authMiddleware } = require("../../Controllers/Auth/auth.controller");

// @desc    Get all users (with search and role filtering)
// @route   GET /api/users
// @access  Private/Admin
router.get("/users", getUsers);

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.get("/users/:id", getUser);

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put(
  "/users/:id/role", authMiddleware,
  updateUserRole
);

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put("/users/:id", updateUser);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete("/users/:id", deleteUser);

module.exports = router;
