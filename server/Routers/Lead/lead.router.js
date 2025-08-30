const express = require("express");
const { checkCustomerByEmail } = require("../../Controllers/Auth/auth.controller");
const { registerNewCustomer, createNewLead, getLeadsfromEmployee } = require("../../Controllers/Lead/lead.controller");

const {createNewQuery} = require("../../Controllers/Lead/query.controller");

const router = express.Router();


router.post("/check-customer" , checkCustomerByEmail);

router.post("/register-new-customer" , registerNewCustomer);

router.post("/create-lead", createNewLead);

router.get("/get-employee-lead/:employeeId" , getLeadsfromEmployee)



//edit the particluart lead

//delete lead



router.post("/new-query"  , createNewQuery);




module.exports = router;






