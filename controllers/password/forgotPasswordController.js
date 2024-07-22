const bcrypt = require("bcrypt");
const sendEmail = require("../../middlewares/nodeMailer");
const userModel = require("../../models/user/userModel");

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    const existingUser = await userModel.findOne({ where: { email } });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }
    try {
      const newPassword = generatePassword(12);
      console.log("newPassword", newPassword);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      console.log("hashedPassword", hashedPassword);
      // Update user password
      await userModel.update({ password: hashedPassword }, { where: { email } });
      const { subject, content } = generateEmailContent(email, newPassword);
      await sendEmail(email, subject, content);
      res.status(200).json({ status: 200, message: "Password reset successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ status: 400, message: "Password reset unsuccessfull" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Function to generate a random password
function generatePassword (length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};
// generate email content
function generateEmailContent (email, password) {
  const subject = "Please find your password";
  const content = `<p>Hello ${email},</p>
    <p>Your password has been updated successfully</p>.
    <p>Email: ${email}</p>
    <p>Password: ${password}</p>
    <p>Thank you for joining!</p>.`;
  return { subject, content };
};
