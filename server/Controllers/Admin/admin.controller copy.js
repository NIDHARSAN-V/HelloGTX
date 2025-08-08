const User = require("../models/User");
const Employee = require("../models/Employee");
const { generatePassword } = require("../utils/authUtils"); // You'll need to implement password generation

/**
 * @desc    Register a new employee (admin only)
 * @route   POST /api/employees/register
 * @access  Private/Admin
 */
const registerEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      alternatePhone,
      dateOfBirth,
      department,
      role // Should be "employee" for regular employees
    } = req.body;

    // Validate that the requester is an admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Only admins can register employees"
      });
    }

    // Validate employee role
    if (role !== 'employee') {
      return res.status(400).json({
        success: false,
        message: "Invalid role for employee registration"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Generate a random password (you might want to send it via email)
    const password = generatePassword(); // Implement this function

    // Create the user first
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      alternatePhone,
      dateOfBirth,
      password,
      role: 'employee' // Force role to be employee
    });

    await newUser.save();

    // Create the employee record linked to the user
    const newEmployee = new Employee({
      department,
      // Other employee-specific fields can be added here
    });

    // Save the employee record
    await newEmployee.save();

    // Update the user with employee reference
    newUser.employeeRef = newEmployee._id;
    await newUser.save();

    // Update the employee with user reference (if needed)
    newEmployee.userRef = newUser._id; // You might want to add this field to your Employee model
    await newEmployee.save();

    // You might want to send a welcome email with temporary password here

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role
        },
        employee: {
          id: newEmployee._id,
          department: newEmployee.department
        }
      }
    });

  } catch (error) {
    console.error("Employee registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering employee",
      error: error.message
    });
  }
};

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private/Admin
 */
const getAllEmployees = async (req, res) => {
  try {
    // Verify admin access
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Admin access required"
      });
    }

    // Get all employees with populated user data
    const employees = await Employee.find()
      .populate('userRef', 'firstName lastName email phone role')
      .select('-__v');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message
    });
  }
};

/**
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Private/Admin
 */
const getEmployeeById = async (req, res) => {
  try {
    // Verify admin access
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Admin access required"
      });
    }

    const employee = await Employee.findById(req.params.id)
      .populate('userRef', 'firstName lastName email phone role')
      .populate('assignedCustomers')
      .populate('leadId')
      .populate('empPerformId')
      .select('-__v');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error("Get employee by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employee",
      error: error.message
    });
  }
};

/**
 * @desc    Update employee details
 * @route   PUT /api/employees/:id
 * @access  Private/Admin
 */
const updateEmployee = async (req, res) => {
  try {
    // Verify admin access
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Admin access required"
      });
    }

    const { department, assignedCustomers, leadId } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Update employee fields
    if (department) employee.department = department;
    if (assignedCustomers) employee.assignedCustomers = assignedCustomers;
    if (leadId) employee.leadId = leadId;

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee
    });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating employee",
      error: error.message
    });
  }
};

/**
 * @desc    Deactivate employee
 * @route   PUT /api/employees/:id/deactivate
 * @access  Private/Admin
 */
const deactivateEmployee = async (req, res) => {
  try {
    // Verify admin access
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Admin access required"
      });
    }

    const employee = await Employee.findById(req.params.id).populate('userRef');
    if (!employee || !employee.userRef) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Deactivate the associated user
    employee.userRef.isActive = false;
    await employee.userRef.save();

    res.status(200).json({
      success: true,
      message: "Employee deactivated successfully"
    });
  } catch (error) {
    console.error("Deactivate employee error:", error);
    res.status(500).json({
      success: false,
      message: "Error deactivating employee",
      error: error.message
    });
  }
};

module.exports = {
  registerEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee
};


