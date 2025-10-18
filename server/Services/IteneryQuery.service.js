// Services/IteneryQuery.service.js
const nodemailer = require('nodemailer');

// Check if environment variables are set
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('⚠️  SMTP credentials not found in environment variables');
  console.warn('Please set SMTP_USER and SMTP_PASS in your .env file');
}

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter configuration with better error handling
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ SMTP configuration error:', error.message);
    console.log('💡 Please check your SMTP credentials in the .env file');
    console.log('💡 For Gmail, make sure to:');
    console.log('   1. Enable 2-factor authentication');
    console.log('   2. Generate an App Password');
    console.log('   3. Use the App Password in SMTP_PASS');
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

// Function to send query itinerary email
const sendQueryItinerary = async (req, res) => {
  try {
    const {
      to_mail,
      from_mail,
      htmlContent,
      customer,
      employee,
      selectedItems,
      leadId
    } = req.body;

    console.log('📧 Received request to send itinerary:', {
      to: to_mail,
      customer: customer?.name,
      selectedItems: selectedItems?.length
    });

    // Validate required fields
    if (!to_mail || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to_mail and htmlContent are required'
      });
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({
        success: false,
        message: 'Email service not configured. Please contact administrator.',
        error: 'SMTP credentials missing'
      });
    }

    // Email options
    const mailOptions = {
      from: `"Travel Agency" <${from_mail || process.env.SMTP_USER}>`,
      to: to_mail,
      subject: `Travel Itinerary - ${customer?.name || 'Your Travel Plan'}`,
      html: htmlContent,
      text: generateTextFallback(customer, employee, selectedItems),
      attachments: []
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: result.messageId,
      to: to_mail
    });

    // Save to database (optional)
    await saveItineraryLog({
      leadId,
      customer,
      employee,
      selectedItems,
      toEmail: to_mail,
      fromEmail: from_mail,
      messageId: result.messageId,
      sentAt: new Date()
    });

    res.json({
      success: true,
      message: 'Itinerary sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('❌ Error sending itinerary email:', error.message);
    
    let userMessage = 'Failed to send itinerary email';
    
    if (error.code === 'EAUTH') {
      userMessage = 'Email authentication failed. Please check email configuration.';
    } else if (error.code === 'ECONNECTION') {
      userMessage = 'Cannot connect to email server. Please try again later.';
    }
    
    res.status(500).json({
      success: false,
      message: userMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Generate text fallback for email
const generateTextFallback = (customer, employee, selectedItems) => {
  return `
TRAVEL ITINERARY
================

Customer: ${customer?.name || 'N/A'}
Email: ${customer?.email || 'N/A'}
Contact: ${customer?.contact || 'N/A'}

Selected Services:
${selectedItems?.map(item => `- ${item.type} ${item.withAmount ? '(With Amount)' : '(Without Amount)'}`).join('\n') || 'No services selected'}

Thank you for choosing our travel services!

For any queries, please contact:
${employee?.name || 'Travel Consultant'}
${employee?.email || 'N/A'}

Generated on: ${new Date().toLocaleString()}
  `;
};

// Optional: Save itinerary log to database
const saveItineraryLog = async (itineraryData) => {
  try {
    console.log('📝 Itinerary log saved:', itineraryData.leadId);
    // Add your database saving logic here
  } catch (error) {
    console.error('Error saving itinerary log:', error);
  }
};

module.exports = { sendQueryItinerary };