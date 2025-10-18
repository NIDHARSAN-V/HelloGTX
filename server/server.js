// require('dotenv').config();  // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const auth_router = require('./Routers/Auth/auth.router');  // Import the auth router
const CustomerProfileRouter = require("./Routers/Profile/customer.profile.router");
const package_router = require('./Routers/Package/package.router');  // Import the package router
// const admin_router = require('./Routers/Admin/admin.router');  // Import the admin router

require('dotenv').config();



const admin_router = require("./Routers/Admin/admin.router copy");  // Import the admin router
const hotel_router = require('./Routers/Hotel/hotelPackage.router');  // Import the hotel router
const flight_router = require('./Routers/Flight/flightPackage.router');  // Import the flight router
const followup_router = require('./Routers/Lead/followup.router');

const employee_router = require('./Routers/Lead/lead.router');
const service_router = require("./Routers/Service/service.router");
require("dotenv").config();  // Load environment variables from .env file
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT" ,"PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);



app.use(cookieParser());
app.use(express.json());

// Auth Routes 
app.use('/api/auth', auth_router);
app.use("/api/customer/profile" ,CustomerProfileRouter )
// Package Routes
app.use('/api/packages', package_router);
// Hotel Routes
app.use('/api/hotel-packages', hotel_router);
// Flight Routes
app.use('/api/flight-packages', flight_router);

// Admin Routes
app.use('/api/admin', admin_router);

app.use('/api/employee' , employee_router );

app.use('/api/followup' , followup_router );

app.use('/api/service' , service_router)

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
