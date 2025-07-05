const { body } = require("express-validator");

const validateSaveProfile = [
  // User data validation
  body("firstName").optional().trim().isLength({ min: 2 }).withMessage("First name must be at least 2 characters"),
  body("lastName").optional().trim().isLength({ min: 2 }).withMessage("Last name must be at least 2 characters"),
  body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
  body("alternatePhone").optional().isMobilePhone().withMessage("Invalid alternate phone number"),
  body("dateOfBirth").optional().isDate().withMessage("Invalid date of birth"),

  // Address validation
  body("address.street").optional().trim(),
  body("address.city").optional().trim(),
  body("address.state").optional().trim(),
  body("address.country").optional().trim(),
  body("address.zipCode").optional().isPostalCode("any").withMessage("Invalid ZIP/postal code"),

  // Passport validation
  body("passport.passportNumber").optional().trim().isLength({ min: 5 }).withMessage("Passport number must be at least 5 characters"),
  body("passport.countryOfIssue").optional().trim(),
  body("passport.dateOfIssue").optional().isDate().withMessage("Invalid issue date"),
  body("passport.dateOfExpiry").optional().isDate().withMessage("Invalid expiry date"),
  body("passport.placeOfIssue").optional().trim(),
  body("passport.nationality").optional().trim(),
  body("passport.documentImage").optional().isURL().withMessage("Invalid document image URL"),

  // Other fields
  body("nationality").optional().trim(),
  body("preferredDestinations").optional().isArray(),
];

module.exports = {
  validateSaveProfile,
};