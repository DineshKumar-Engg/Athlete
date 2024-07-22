const bcrypt = require("bcrypt");
// Schema Models Import
const adminModel = require("../../models/admin/adminModel");
const userModel = require("../../models/user/userModel");
const roleModel = require("../../models/role/roleModel");
const galleryModel = require("../../models/gallery/galleryModel");
// add admin controllers
exports.addAdmin = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { firstName, lastName, email, password, profileImg } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ status: 400, message: "Email and password are required" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ status: 409, message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      // Create a new admin user and retrieve the created user
      const createdUser = await userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profileImg,
        profileInfo: 1,
        roleId: 1
      });

      // Create a new admin
      const newAdmin = await adminModel.create({
        roleId: 1
      });

      // Update the createdUser and updatedUser fields for the user and admin records
      await createdUser.update({ profileInfo: newAdmin.id, createdUser: createdUser.id, updatedUser: createdUser.id });
      await newAdmin.update({ createdUser: createdUser.id, updatedUser: createdUser.id });

      // Send a success response to the client
      return res.status(201).json({ status: 201, message: "User added successfully" });
    } catch (error) {
      console.error("Add admin API error:", error);
      return res.status(500).json({ status: 500, message: "Error occurred while adding user" });
    }
  } catch (error) {
    console.error("Add admin API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Get admin details
exports.getAdmin = async (req, res, next) => {
  try {
    console.log("get admin user", req?.user);

    const reqUserId = req.user.id;
    const reqUserEmail = req.user.email;
    console.log("reqUserId", reqUserId, reqUserEmail);

    const reqUser = await userModel.findOne({
      where: { id: reqUserId, email: reqUserEmail },
      include: [{ model: roleModel }, { model: galleryModel }]
    });
    console.log("reqUser", reqUser);

    if (reqUser) {
      return res.status(200).json({ status: 200, message: "Success", data: reqUser });
    } else {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
  } catch (error) {
    console.error("Get admin API error:", error);
    return res.status(500).json({ status: 500, message: "Internal Server error" });
  }
};

// Edit Admin Details
exports.editAdmin = async (req, res, next) => {
  try {
    console.log("user", req.user);
    console.log("body", req.body);
    const reqUserId = req.user.id;
    const reqUserEmail = req.user.email;

    const createdUser = await userModel.findOne({
      where: { id: reqUserId, email: reqUserEmail }
    });
    console.log("reqUserprofileInfo", createdUser.profileInfo);
    const newAdmin = await adminModel.findOne({ where: { id: createdUser.profileInfo } });
    console.log("newAdmin", newAdmin);
    if (createdUser) {
      let count = 0;
      const { firstName, lastName, profileImg, email } = req.body;

      if (firstName && firstName !== createdUser.firstName) {
        await createdUser.update({ firstName });
        count++;
      }
      if (lastName && lastName !== createdUser.lastName) {
        await createdUser.update({ lastName });
        count++;
      }
      if (profileImg && profileImg !== createdUser.profileImg) {
        await createdUser.update({ profileImg });
        count++;
      }
      if (email && email !== createdUser.email) {
        await createdUser.update({ email });
        count++;
      }

      if (count > 0) {
        await createdUser.update({ updatedUser: createdUser.id });
        await newAdmin.update({ updatedUser: createdUser.id });

        return res.status(200).json({ status: 200, message: "Data updates successfully" });
      } else {
        return res.status(200).json({ status: 200, message: "Nothing is changes" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
  } catch (error) {
    console.error("Edit admin API error:", error);
    return res.status(500).json({ status: 500, message: "Internal Server error" });
  }
};
