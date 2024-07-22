const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
// Schema Models Import
const roleModel = require("../../models/role/roleModel");
const userModel = require("../../models/user/userModel");
const athleteModel = require("../../models/athlete/athleteModel");
const adminModel = require("../../models/admin/adminModel");
const coachModel = require("../../models/coach/coachModel");
const academiesModel = require("../../models/academies/academiesModel");
// admin login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ where: { email, deletedAt: { [Op.is]: null } } });
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    // Retrieve user's role
    const role = await roleModel.findOne({ where: { id: user.roleId } });
    if (!role) {
      return res.status(500).json({ status: 500, message: "Role not found for the user" });
    }

    // Retrieve profile data based on user's role
    let profileData = null;

    switch (user.roleId) {
    case 1: // Admin
      // Admin does not have specific profile data, sport data, or subscription data
      profileData = await adminModel.findOne({ where: { id: user.profileInfo } });
      break;
    case 2: // Athlete
      profileData = await athleteModel.findOne({ where: { id: user.profileInfo } });
      break;
    case 3: // Coach
      profileData = await coachModel.findOne({ where: { id: user.profileInfo } });
      break;
    case 4: // Academies
      profileData = await academiesModel.findOne({ where: { id: user.profileInfo } });
      break;
    default:
      break;
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ status: 400, message: "Wrong Password" });
    }

    // Generate JWT token
    const token = generateAccessToken(user.id, user.email, role.roleType, user.roleId);
    if (!token) {
      return res.status(401).json({ status: 401, message: "Error generating token" });
    }
    return res.status(200).json({
      status: 200,
      message: "Login successful",
      token,
      user,
      profileData
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: 500, message: "Internal Server error" });
  }
};

function generateAccessToken (id, email, roleType, roleId) {
  return jwt.sign({ id, email, roleType, roleId }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "7d"
  });
}
