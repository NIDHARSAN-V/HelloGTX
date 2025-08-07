// https://chat.deepseek.com/a/chat/s/351d4546-42ed-4f5f-9f6c-cde49fbce1db


const User = require("../../Models/Auth/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailjs = require('@emailjs/nodejs');
const crypto = require("crypto");
const Customer = require("../../Models/Auth/Users/customer.model")




const registerNewCustomer = async function(req,  res)
{
      console.log("called registerNewCustomer");
       try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      alternatePhone,
      dateOfBirth,
      role,
      address,
      passport,
      nationality,
      preferredDestinations
    } = req.body;


    console.log(firstName);

    // Basic validation
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      alternatePhone,
      dateOfBirth,
      role: role || 'customer',
      isVerified: true // Skip verification since this is admin/agent created
    });

    // Create customer profile
    const customer = await Customer.create({
      userId: user._id,
      address: address || {},
      nationality,
      preferredDestinations: preferredDestinations || [],
      passport: {
        passportNumber: passport?.passportNumber || 'TEMP-' + Math.random().toString(36).substring(2, 10),
        countryOfIssue: passport?.countryOfIssue || 'TBD',
        dateOfIssue: passport?.dateOfIssue || new Date(),
        dateOfExpiry: passport?.dateOfExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        placeOfIssue: passport?.placeOfIssue || '',
        nationality: passport?.nationality || nationality || '',
        isVerified: false
      }
    });


    console.log("called before update");
    
    // Update user with customer reference
    await User.findByIdAndUpdate(user._id, { customerRef: customer._id });
    console.log("called before update");

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: {
        user,
        customer
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Customer registration failed"
    });
  }
}


module.exports = {
registerNewCustomer
};



