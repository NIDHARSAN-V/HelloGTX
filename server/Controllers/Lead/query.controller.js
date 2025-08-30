
const User = require("../../Models/Auth/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailjs = require('@emailjs/nodejs');
const crypto = require("crypto");
const Customer = require("../../Models/Auth/Users/customer.model")
const Employee = require("../../Models/Auth/Users/empolyee.model");

const Lead =  require("../../Models/Leads/lead.model");





const createNewQuery = async (req, res) => {
  try {



         console.log(req.body , "Request body in query controller")
        

//     const { customerId, queryDetails } = req.body;

//     // Validate input
//     if (!customerId || !queryDetails) {
//       return res.status(400).json({ message: "Invalid input" });
//     }

//     // Create a new query
//     const newQuery = new Query({
//       customer: customerId,
//       details: queryDetails,
//       status: "new"
//     });

//     await newQuery.save();

//     res.status(201).json({ message: "Query created successfully", query: newQuery });



  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





module.exports = {
  createNewQuery
};
