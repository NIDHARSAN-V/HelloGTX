const express = require("express");
const ServiceRouter = express.Router();
const { sendQueryItinerary } = require("../../Services/IteneryQuery.service");

ServiceRouter.post("/itinerary/query/send" , sendQueryItinerary );

module.exports = ServiceRouter;