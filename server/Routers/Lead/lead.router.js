const express = require("express");
const { checkCustomerByEmail } = require("../../Controllers/Auth/auth.controller");
const router = express.Router();


router.post("/check-customer" , checkCustomerByEmail);

module.exports = router;
