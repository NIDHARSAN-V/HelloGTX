// Services/Reminder.service.js
const nodemailer = require("nodemailer");

// 🟡 Validate environment variables
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("⚠️  SMTP credentials not found in environment variables");
  console.warn("Please set SMTP_USER and SMTP_PASS in your .env file");
}

// 🟢 Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🧩 Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP configuration error:", error.message);
    console.log("💡 Please verify your SMTP credentials in the .env file");
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

// 📤 Helper to send emails
const sendMail = async (to, subject, text) => {
  try {
    const result = await transporter.sendMail({
      from: `"Reminder Service" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`✅ Mail sent successfully to ${to}: ${subject}`);
    return result;
  } catch (err) {
    console.error("❌ Failed to send mail:", err.message);
    throw err;
  }
};

// 🕐 Main function to schedule reminders
const sendRemainderEmailEmployee = (employeeEmail, scheduledAt) => {
  console.log("📅 Scheduling reminders for:", employeeEmail, "at", scheduledAt);

  const scheduleTime = new Date(scheduledAt);
  const now = new Date();

  if (isNaN(scheduleTime)) {
    console.error("❌ Invalid scheduled time:", scheduledAt);
    return "Invalid scheduled time format.";
  }

  const reminders = [
    { label: "15 minutes before", delay: scheduleTime - 15 * 60 * 1000 - now },
    { label: "10 minutes before", delay: scheduleTime - 10 * 60 * 1000 - now },
    { label: "on time", delay: scheduleTime - now },
  ];


 //reminder employeemail

  reminders.forEach((reminder) => {
    if (reminder.delay > 0) {
      setTimeout(() => {
        const localTime = scheduleTime.toLocaleString();
        const subject = `⏰ Reminder: Task ${reminder.label}`;
        const message = `Hello!\n\nThis is a reminder ${reminder.label} your scheduled task at ${localTime} (local time).\n\n- Reminder Service`;

        sendMail(employeeEmail, subject, message);
      }, reminder.delay);

      console.log(`🕒 Scheduled "${reminder.label}" email (${Math.round(reminder.delay / 60000)} mins from now)`);
    } else {
      console.log(`⚠️ Skipping "${reminder.label}" (time already passed)`);
    }
  });

  return "Reminders scheduled successfully.";
};

module.exports = { sendRemainderEmailEmployee };
