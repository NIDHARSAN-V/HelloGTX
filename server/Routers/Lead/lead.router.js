const express = require("express");
const { checkCustomerByEmail } = require("../../Controllers/Auth/auth.controller");
const { registerNewCustomer, createNewLead, getLeadsfromEmployee, getLeadDetail } = require("../../Controllers/Lead/lead.controller");

const {createNewQuery, getQueriesByLead} = require("../../Controllers/Lead/query.controller");

const router = express.Router();


router.post("/check-customer" , checkCustomerByEmail);

router.post("/register-new-customer" , registerNewCustomer);

router.post("/create-lead", createNewLead);

router.get("/get-employee-lead/:employeeId" , getLeadsfromEmployee)



//edit the particluart lead

//delete lead



router.get("/get-lead/:leadId" , getLeadDetail);



router.post("/new-query"  , createNewQuery);
router.get("/get-queries/:leadId"  ,getQueriesByLead); 
// In your routes file
router.put('/edit-query/:queryId', editQuery);



module.exports = router;






