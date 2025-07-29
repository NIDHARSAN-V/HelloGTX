require('dotenv').config();
const express = require('express');
const emailjs = require('@emailjs/nodejs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static HTML from public/

// Utility to send email
const sendItineraryEmail = async (email, params = {}) => {
  try {
    const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env;
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
      throw new Error("Missing EmailJS environment variables.");
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { email: email},
      { publicKey: EMAILJS_PUBLIC_KEY, privateKey: EMAILJS_PRIVATE_KEY }
    );

    console.log(`✅ Email sent to ${email}:`, response.status);
    return true;
  } catch (error) {
    console.error(`❌ Email send failed:`, error?.text || error?.message);
    return false;
  }
};

// HTML form will POST here
app.post('/send-itinerary', async (req, res) => {
  let { email, name, title, itinerary_link } = req.body;

  // Trim input to handle "  " as empty
  email = email?.trim();
  name = name?.trim();
  title = title?.trim();
  itinerary_link = itinerary_link?.trim();

  if (!email || !name || !title || !itinerary_link) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const success = await sendItineraryEmail(email, { name, title, itinerary_link });

  res.status(success ? 200 : 500).json({
    success,
    message: success
      ? "Itinerary email sent successfully."
      : "Failed to send itinerary email."
  });
});


// Root route serves the form.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Itinerary Server running at http://localhost:${PORT}`);
});
