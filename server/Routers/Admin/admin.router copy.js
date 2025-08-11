const express = require('express');
const router = express.Router();
const {
  registerEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee
} = require('../../Controllers/Admin/admin.controller copy');


// Employee Registration Route
router.post('/register', registerEmployee);

// Get All Employees
router.get('/', getAllEmployees);

// Get Single Employee
router.get('/:id', getEmployeeById);

// Update Employee
router.put('/:id', updateEmployee);

// Deactivate Employee
router.put('/:id/deactivate', deactivateEmployee);

module.exports = router;