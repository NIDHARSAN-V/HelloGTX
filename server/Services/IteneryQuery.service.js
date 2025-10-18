const emailjs = require('@emailjs/nodejs');

// Function to send query itinerary email
const sendQueryItinerary = async (req, res) => {
  
  console.log(req.body);
  return res.status(200).json({ message: 'Request received' });
    
};

module.exports = { sendQueryItinerary };
