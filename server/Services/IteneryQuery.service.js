const emailjs = require('@emailjs/nodejs');

// Function to send query itinerary email
const sendQueryItinerary = async (req, res) => {
  try {
    const { email, name, title, itinerary_link } = req.body;

    // Validate required fields
    if (!email || !name || !title || !itinerary_link) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env;
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
      throw new Error("Missing EmailJS environment variables.");
    }

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { email, name, title, itinerary_link },
      { publicKey: EMAILJS_PUBLIC_KEY, privateKey: EMAILJS_PRIVATE_KEY }
    );

    console.log(`✅ Email sent to ${email}:`, response.status);
    return res.status(200).json({ success: true, message: "Itinerary email sent successfully." });

  } catch (error) {
    console.error(`❌ Email send failed:`, error?.text || error?.message);
    return res.status(500).json({ success: false, message: "Failed to send itinerary email." });
  }
};

module.exports = { sendQueryItinerary };
