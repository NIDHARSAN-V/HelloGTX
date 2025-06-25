const User = require("../../Models/auth/UserModel"); // Adjust the path as necessary
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  try {
    console.log("Registering user with data:", req.body);
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      alternatePhone,
      dateOfBirth,
      role = "customer",
    } = req.body;

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      alternatePhone,
      dateOfBirth,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration.",
    });
  }
};






// Login User
const loginUser = async (req, res) => {
  try {
    console.log("Logging in user with data:", req.body);
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist. Please register first.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
      "CLIENT_SEC_KEY", // Use env variable in production!
      { expiresIn: "1d" }
    );

    // Send cookie and response
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000,   
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
};







// Logout User
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};




// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, "CLIENT_SEC_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
  }
};



module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};
