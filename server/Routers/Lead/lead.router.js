const express = require("express");
const { checkCustomerByEmail } = require("../../Controllers/Auth/auth.controller");
const { registerNewCustomer, createNewLead } = require("../../Controllers/Lead/lead.controller");
const router = express.Router();


router.post("/check-customer" , checkCustomerByEmail);

router.post("/register-new-customer" , registerNewCustomer);

router.post("/create-lead", createNewLead);


module.exports = router;
