// https://chat.deepseek.com/a/chat/s/351d4546-42ed-4f5f-9f6c-cde49fbce1db


const User = require("../../Models/Auth/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailjs = require('@emailjs/nodejs');
const crypto = require("crypto");
const Customer = require("../../Models/Auth/Users/customer.model")
const Employee = require("../../Models/Auth/Users/empolyee.model");

const Lead =  require("../../Models/Leads/lead.model");


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




const createNewLead = async function(req,res)
{
    try {

      console.log(req.body)

      const {assignedTo ,  assignedFor , status , source }  = req.body;
      
      //


   const customerData = await Customer.findById(assignedFor).populate({ path: 'userId' });

  console.log("------------------------------" , customerData)

      const newLead = await Lead.create({
        assignedTo: assignedTo,
        assignedFor: assignedFor,
        firstName : customerData.userId.firstName,
        lastName : customerData.userId.lastName,
        email : customerData.userId.email,
        phone : customerData.userId.phone,
        status:  status,
        source:source

      });






      const employee = await Employee.findById(assignedTo);
     
      employee.leadId.push(newLead._id);

      await employee.save();

      

      return res.status(201).json({
        success: true,
        message: "Lead created successfully",
        data: newLead
      });

    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create lead"
      });
    }
}


const getLeadsfromEmployee = async function(req, res) {
  try {
    const { empid } = req.body; // expecting { empid: "employeeId" }

    if (!empid) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required"
      });
    }

    // const employee = await Employee.findById(empid).populate({
    //   path: 'leadId', // or 'leads' if that's the field name in your Employee model
    //   populate: {
    //     path: 'assignedFor',
    //     model: 'Customer'
    //   }
    // });


      const employee = await Employee.findById(empid).populate({
      path: 'leadId', // or 'leads' if that's the field name in your Employee model
     
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      leads: employee.leadId // or employee.leads if that's the field name
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads"
    });
  }
}









module.exports = {
registerNewCustomer,
createNewLead,
getLeadsfromEmployee  
};



