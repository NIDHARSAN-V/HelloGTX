const User = require("../../Models/auth/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailjs = require('@emailjs/nodejs');
const crypto = require("crypto");

// In-memory OTP storage (replace with Redis in production)
const otpStorage = new Map();

// Generate 6-digit OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Enhanced EmailJS sender with retries
const sendOTPEmail = async (email, otp, maxRetries = 2) => {
  let attempts = 0;
  while (attempts <= maxRetries) {
    try {
      if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID) {
        throw new Error("EmailJS service not configured");
      }

      const response = await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          otp: otp,
          app_name: process.env.APP_NAME || "HelloGTX",
          expiry_time: "10 minutes"
        },
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY,
          privateKey: process.env.EMAILJS_PRIVATE_KEY
        }
      );

      console.log(`Email sent to ${email}, response`);
      return true;
    } catch (error) {
      attempts++;
      if (attempts > maxRetries) {
        console.error(`EmailJS Failed after ${maxRetries} attempts:, {
          status: error?.status,
          message: error?.text,
          stack: error?.stack
        }`);
        throw new Error(error.text || "Failed to send OTP after multiple attempts");
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
    }
  }
};

// User Registration with OTP
const registerUser = async (req, res) => {
  try {

    console.log("Register Data Fucntion");
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Store OTP with user data
    const otp = generateOTP();
    otpStorage.set(email, {
      otp,
      expiresAt: Date.now() + 600000, // 10 minutes
      userData: req.body
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
      email: email,
      otpExpiresIn: "10 minutes"
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : "Registration service unavailable"
    });
  }
};

// OTP Verification
const verifyRegistrationOTP = async (req, res) => {
  try {
    console.log("OTP at back function");
    const { email, otp } = req.body;
    const storedData = otpStorage.get(email);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid"
      });
    }

    if (storedData.expiresAt < Date.now()) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(storedData.userData.password, 12);
    const newUser = new User({
      ...storedData.userData,
      password: hashedPassword,
      isVerified: true
    });

    await newUser.save();
    otpStorage.delete(email);

    return res.status(201).json({
      success: true,
      message: "Registration complete"
    });

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};

// Password Reset Flow
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: "If email exists, OTP will be sent"
      });
    }

    const otp = generateOTP();
    otpStorage.set(email, {
      otp,
      expiresAt: Date.now() + 600000,
      purpose: 'password_reset'
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent if email exists"
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Password reset service unavailable"
    });
  }
};




const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const storedData = otpStorage.get(email);
    if (!storedData || storedData.purpose !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: "Invalid request"
      });
    }

    if (storedData.expiresAt < Date.now()) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    otpStorage.delete(email);

    return res.status(200).json({
      success: true,
      message: "Password updated"
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed"
    });
  }
};

// Authentication
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800000, // 7 days
      sameSite: "strict"
    });

    return res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login service unavailable"
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out"
  });
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};




module.exports = {
  registerUser,
  verifyRegistrationOTP,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword
};