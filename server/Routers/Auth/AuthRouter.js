const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../Controllers/Auth/AuthController");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logoutUser);

// Example protected route
router.get("/check-auth", authMiddleware , function(req,res)
{
    const user = req.user;
    res.status(200).json({
        success:true,
        message:"User is Authenticated",
        user
    })

})

module.exports = router;
