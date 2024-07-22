const nodemailer = require("nodemailer");

const sendEmail = async (receipientEmail, subject, content) => {
  try {
    // Email service configure
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Define email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receipientEmail,
      subject,
      html: content
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
