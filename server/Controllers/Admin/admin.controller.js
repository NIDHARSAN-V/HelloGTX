const User = require("../../Models/Auth/user.model")

// @desc    Get all users
const getUsers = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await User.find(query)
      .select("-password -verificationToken -resetPasswordToken -loginHistory")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -verificationToken -resetPasswordToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ["super_admin", "admin", "employee", "customer"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    // if (req.params.id === req.user.id && role !== req.user.role) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You cannot change your own role",
    //   });
    // }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password -verificationToken -resetPasswordToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user details
const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, isActive } = req.body;

    if (req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Please use the password reset route to change passwords",
      });
    }

    const updateFields = { firstName, lastName, email, phone, isActive };
    const user = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password -verificationToken -resetPasswordToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUserRole,
  updateUser,
  deleteUser,
};
