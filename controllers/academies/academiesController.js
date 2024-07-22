const sendEmail = require("../../middlewares/nodeMailer");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const academieModel = require("../../models/academies/academiesModel");
const userModel = require("../../models/user/userModel");
const subscriptionModel = require("../../models/reports/subscriptionModule");
const sportModel = require("../../models/common/sportsModel");
const roleModel = require("../../models/role/roleModel");
const galleryModel = require("../../models/gallery/galleryModel");
const citiesModel = require("../../models/cities/citiesModel");
const statesModel = require("../../models/states/statesModel");
// const transactionHistoryModel = require("../../models/transaction/transactionHistoryModel");
exports.adminAddAcademies = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      profileImg,
      academieName,
      title,
      bio,
      city,
      state,
      leagueName,
      ageYouCoach,
      genderYouCoach,
      instagramLink,
      twitterLink,
      websiteLink,
      sportsId,
      subscriptionId
    } = req.body;

    console.log("Request body data:", req.body);

    // Check if athlete with the same email already exists
    const existingUser = await userModel.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ status: 409, message: "User already exists" });
    }

    try {
      // const saltRounds = 10;
      // const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await userModel.create({
        firstName,
        lastName,
        email,
        // password: hashedPassword,
        password,
        profileImg,
        profileInfo: 4,
        roleId: 4
      });

      // Create a new athlete
      const newAcademie = await academieModel.create({
        academieName,
        title,
        bio,
        phone,
        city,
        state,
        leagueName,
        ageYouCoach,
        genderYouCoach,
        instagramLink,
        twitterLink,
        websiteLink,
        sportsId,
        subscriptionId,
        isApprove: "Pending",
        isPublish: false,
        isActive: false,
        isSubscription: "Inactive",
        roleId: 4
      });

      const reqUserId = req.user.id;

      // Check if req.user.id is valid
      if (!reqUserId) {
        return res.status(401).json({ status: 401, message: "Unauthorized user" });
      }

      // Update the user and athlete with the correct IDs
      await newUser.update({
        profileInfo: newAcademie.id,
        createdUser: req.user.id,
        updatedUser: req.user.id
      });

      await newAcademie.update({
        createdUser: req.user.id,
        updatedUser: req.user.id,
        userId: newUser.id
      });

      // Generate email content and send email
      // const recordType = "Academie";
      // const { subject, content } = generateEmailContent(
      //   recordType,
      //   email,
      //   password
      // );

      // await sendEmail(email, subject, content);

      return res.status(201).json({ status: 201, message: "Academie/club added successfully", data: newUser });
    } catch (error) {
      // Handle specific errors related to athlete creation here
      console.error("Add Academie/club API error:", error);

      return res.status(500).json({ status: 500, message: "Internal server error" });
    }
  } catch (error) {
    // Handle other errors here
    console.error("Add athlete API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Register Academies
exports.registerAcademies = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      profileImg,
      academieName,
      title,
      bio,
      city,
      phone,
      state,
      leagueName,
      ageYouCoach,
      genderYouCoach,
      instagramLink,
      twitterLink,
      websiteLink,
      sportsId,
      subscriptionId
    } = req.body;

    console.log("Request body data:", req.body);

    // Check if athlete with the same email already exists
    const existingUser = await userModel.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ status: 409, message: "User already exists" });
    }

    try {
      // const saltRounds = 10;
      // const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await userModel.create({
        firstName,
        lastName,
        email,
        // password: hashedPassword,
        password,
        profileImg,
        profileInfo: 4,
        roleId: 4
      });

      // Create a new athlete
      const newAcademie = await academieModel.create({
        academieName,
        title,
        bio,
        city,
        state,
        phone,
        leagueName,
        ageYouCoach,
        genderYouCoach,
        instagramLink,
        twitterLink,
        websiteLink,
        sportsId,
        subscriptionId,
        isApprove: "Pending",
        isPublish: false,
        isActive: false,
        isSubscription: "Inactive",
        roleId: 4
      });
      // Update the user and athlete with the correct IDs
      await newUser.update({
        profileInfo: newAcademie.id,
        createdUser: newUser.id,
        updatedUser: newUser.id
      });

      await newAcademie.update({
        createdUser: newUser.id,
        updatedUser: newUser.id,
        userId: newUser.id
      });
      // Generate email content and send email
      const recordType = "Academie";
      const { subject, content } = generateEmailContentForAdmin(
        recordType,
        firstName,
        lastName,
        email
      );

      // Send email to admin
      const adminEmail = process.env.ADMIN_EMAIL;
      await sendEmail(adminEmail, subject, content);

      return res.status(200).json({ status: 200, message: "Academie/club added successfully" });
    } catch (error) {
      // Handle specific errors related to athlete creation here
      console.error("Add Academie/club API error:", error);

      return res.status(500).json({ status: 500, message: "Internal server error" });
    }
  } catch (error) {
    // Handle other errors here
    console.error("Add athlete API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Delete academies
exports.deleteAcademies = async (req, res, next) => {
  try {
    const academieId = req.params.id;
    console.log("deleteId", academieId);

    // Find the user associated with the academy
    const userData = await userModel.findOne({ where: { id: academieId, roleId: 4 } });
    console.log("userDataInfo", userData);

    // If user not found, return 401
    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    // Delete the user
    const userDelete = await userModel.destroy({ where: { id: academieId } });
    console.log("userDelete", userDelete);

    // Delete the academy
    const academieDelete = await academieModel.destroy({ where: { id: userData.profileInfo } });
    console.log("academieDelete", academieDelete);

    // Check if any rows were affected
    if (userDelete > 0 || academieDelete > 0) {
      return res.status(200).json({ status: 200, message: "Academies/club deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Academies/club not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Athlete API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Update athlete
exports.updateAcademies = async (req, res, next) => {
  try {
    const userId = req.body.id;
    console.log("Request body data:", req.body);

    // const userData = await userModel.findByPk(athleteId);
    const userData = await userModel.findOne({ where: { id: userId, roleId: 4 } });
    console.log("userDataInfo", userData);
    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    const academieId = userData?.profileInfo;
    const academieData = await academieModel.findByPk(academieId);

    console.log("academieData", academieData);
    console.log("existingUser", userData);

    if (userData && academieData) {
      let count = 0;
      const {
        firstName,
        lastName,
        email,
        profileImg,
        academieName,
        title,
        phone,
        bio,
        city,
        state,
        leagueName,
        ageYouCoach,
        genderYouCoach,
        instagramLink,
        twitterLink,
        websiteLink,
        sportsId,
        subscriptionId,
        isApprove,
        isPublish,
        isSubscription
      } = req.body;

      if (firstName && firstName !== userData.firstName) {
        await userData.update({ firstName });
        count++;
      }
      if (lastName && lastName !== userData.lastName) {
        await userData.update({ lastName });
        count++;
      }
      if (profileImg && profileImg !== userData.profileImg) {
        await userData.update({ profileImg });
        count++;
      }
      if (email && email !== userData.email) {
        // Check if the email already exists in another user's record
        const existingEmailUser = await userModel.findOne({ where: { email, id: { [Op.ne]: userId } } });
        if (existingEmailUser) {
          return res.status(400).json({ status: 400, message: "Email already exists in another record" });
        }
        await userData.update({ email });
        count++;
      }
      // if (email && email !== userData.email) {
      //   await userData.update({ email });
      //   count++;
      // }
      if (academieName && academieName !== academieData.academieName) {
        await academieData.update({ academieName });
        count++;
      }
      if (title && title !== academieData.gender) {
        await academieData.update({ title });
        count++;
      }
      if (city && city !== academieData.city) {
        await academieData.update({ city });
        count++;
      }
      if (bio && bio !== academieData.bio) {
        await academieData.update({ bio });
        count++;
      }
      if (state && state !== academieData.state) {
        await academieData.update({ state });
        count++;
      }
      if (leagueName && leagueName !== academieData.leagueName) {
        await academieData.update({ leagueName });
        count++;
      }
      if (instagramLink && instagramLink !== academieData.instagramLink) {
        await academieData.update({ instagramLink });
        count++;
      }
      if (twitterLink && twitterLink !== academieData.twitterLink) {
        await academieData.update({ twitterLink });
        count++;
      }
      if (websiteLink && websiteLink !== academieData.websiteLink) {
        await academieData.update({ websiteLink });
        count++;
      }
      if (ageYouCoach && ageYouCoach !== academieData.ageYouCoach) {
        await academieData.update({ ageYouCoach });
        count++;
      }
      if (genderYouCoach && genderYouCoach !== academieData.genderYouCoach) {
        await academieData.update({ genderYouCoach });
        count++;
      }
      if (sportsId && sportsId !== academieData.sportsId) {
        await academieData.update({ sportsId });
        count++;
      }
      if (subscriptionId && subscriptionId !== academieData.subscriptionId) {
        await academieData.update({ subscriptionId });
        count++;
      }
      if (phone && phone !== academieData.phone) {
        await academieData.update({ phone });
        count++;
      }
      if (isApprove && isApprove !== academieData.isApprove) {
        await academieData.update({ isApprove });
        count++;
      }
      if (isSubscription && isSubscription !== academieData.isSubscription) {
        await academieData.update({ isSubscription });
        count++;
      }
      // if (isActive && isActive !== academieData.isActive) {
      //   await academieData.update({ isActive });
      //   count++;
      // }
      if (isPublish && isPublish !== academieData.isPublish) {
        await academieData.update({ isPublish });
        count++;
      }
      if (count > 0) {
        await userData.update({ updatedUser: req?.user?.id });
        await academieData.update({ updatedUser: req?.user?.id });

        return res.status(200).json({ status: 200, message: "Data updates successfully", data: userData });
      } else {
        return res.status(200).json({ status: 200, message: "Nothing is changed" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
  } catch (error) {
    console.log("Delete academies API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.getAllAcademies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Check if the user is admin
    if (req.user.roleId !== 1) {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
    // Fetch all cities, states, specialties, and sports
    const citiesData = await citiesModel.findAll();
    const stateData = await statesModel.findAll();
    const sportData = await sportModel.findAll();

    // Create mappings from ID to object for cities, states, specialties, and sports
    const cityMap = {};
    citiesData.forEach(city => {
      cityMap[city.id] = city;
    });

    const stateMap = {};
    stateData.forEach(state => {
      stateMap[state.id] = state;
    });

    const sportMap = {};
    sportData.forEach(sport => {
      sportMap[sport.id] = sport;
    });
    // Construct query parameters for filtering
    const whereClause = {};
    if (req.query.city && req.query.city !== "0") {
      const cityIds = req.query.city.split(",").map(id => parseInt(id, 10));
      whereClause.city = { [Op.or]: cityIds.map(id => ({ [Op.like]: `%${id}%` })) };
    }
    if (req.query.state && req.query.state !== "0") {
      const stateIds = req.query.state.split(",").map(id => parseInt(id, 10));
      whereClause.state = { [Op.or]: stateIds.map(id => ({ [Op.like]: `%${id}%` })) };
    }
    if (req.query.sportsId && req.query.sportsId !== "0") {
      const sportsIds = req.query.sportsId.split(",").map(id => parseInt(id, 10));
      whereClause.sportsId = { [Op.or]: sportsIds.map(id => ({ [Op.like]: `%${id}%` })) };
    }
    if (req.query.isPublish) {
      whereClause.isPublish = req.query.isPublish;
    }
    if (req.query.isSubscription) {
      whereClause.isSubscription = req.query.isSubscription;
    }

    // Fetch data based on the constructed query
    const allAcademies = await academieModel.findAll({
      where: whereClause,
      include: [
        {
          model: userModel,
          attributes: { exclude: ["password"] },
          include: [
            {
              model: galleryModel
            }
          ]
        },
        {
          model: subscriptionModel
        }
      ],
      limit,
      offset
    });
    // Add full city, state, specialty, and sport objects to the response
    const formattedAcademies = allAcademies.map(academie => {
      const academieData = academie.toJSON();

      // Parse city and map to cityData
      if (academieData.city && typeof academieData.city === "string") {
        const cityIds = academieData.city.split(",").map(id => parseInt(id));
        academieData.citiesData = cityIds.map(id => cityMap[id]).filter(Boolean);
      } else {
        academieData.citiesData = [];
      }

      // Parse state and map to stateData
      if (academieData.state && typeof academieData.state === "string") {
        const stateIds = academieData.state.split(",").map(id => parseInt(id));
        academieData.stateData = stateIds.map(id => stateMap[id]).filter(Boolean);
      } else {
        academieData.stateData = [];
      }

      // Parse sportsId and map to sportData
      if (academieData.sportsId && typeof academieData.sportsId === "string") {
        const sportIds = academieData.sportsId.split(",").map(id => parseInt(id));
        academieData.sports = sportIds.map(id => sportMap[id]).filter(Boolean);
      } else {
        academieData.sports = [];
      }

      return academieData;
    });
    return res.status(200).json({ status: 200, message: "Success", data: formattedAcademies });
  } catch (error) {
    console.error("Get all academy API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// get Athlete details
exports.getAcademies = async (req, res, next) => {
  try {
    const academieId = req.params.id;
    console.log("academieId", academieId);

    // Fetch user data
    const userData = await userModel.findOne({ attributes: { exclude: ["password"] }, where: { id: academieId, roleId: 4 } });
    console.log("userData", userData);

    if (!userData) {
      return res.status(404).json({ status: 404, message: "Academies not found" });
    }

    // Fetch coach data
    const academieData = await academieModel.findOne({ where: { id: userData.profileInfo } });
    console.log("athleteData", academieData);

    if (!academieData) {
      return res.status(404).json({ status: 404, message: "academieData profile not found" });
    }

    // Fetch role data
    const roleData = await roleModel.findOne({ where: { id: userData.roleId } });
    console.log("roleData", roleData);

    if (!roleData) {
      return res.status(404).json({ status: 404, message: "Role not found for this academie" });
    }

    // Fetch subscription data
    const subscriptionData = await subscriptionModel.findOne({ where: { id: academieData.subscriptionId } });

    // Fetch transactionData data
    // const transactionData = await transactionHistoryModel.findAll({ where: { subscriptionId: subscriptionData?.id } });
    // console.log("transactionData", transactionData);

    // Fetch gallery data
    const galleryData = await galleryModel.findAll({ where: { userId: academieId } });
    // Parse and filter state and city IDs from academieData
    const stateIds = academieData.state.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const cityIds = academieData.city.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const uniqueCityIds = Array.from(new Set(cityIds));

    // Fetch all matched states and cities
    const stateData = await statesModel.findAll({
      where: { id: { [Op.in]: stateIds } }
    });
    const citiesDataRaw = await citiesModel.findAll({
      where: { id: { [Op.in]: uniqueCityIds } }
    });

    // Remove duplicate city records
    const citiesData = citiesDataRaw.reduce((unique, city) => {
      if (!unique.some(obj => obj.id === city.id)) {
        unique.push(city);
      }
      return unique;
    }, []);
    // Fetch sport data
    const sportIds = academieData.sportsId.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const sportData = await sportModel.findAll({ where: { id: { [Op.in]: sportIds } } });
    console.log("sportData", sportData);
    return res.status(200).json({ status: 200, message: "Success", data: { userData, academieData, stateData, citiesData, roleData, sportData, subscriptionData, galleryData } });
  } catch (error) {
    console.error("Get athlete API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// status change controller
exports.academieIsPublish = async (req, res, next) => { 
  try {
    const academieId = req.params.id;
    const { isPublish } = req.body;

    console.log("academieId:", academieId, "isPublish:", isPublish);

    const academieData = await academieModel.findOne({ where: { id: academieId, roleId: 4 } });
    console.log("academieData:", academieData);

    if (!academieData) {
      return res.status(404).json({ status: 404, message: "Academie/club not found" });
    }

    if (academieData.isSubscription === "Inactive" || academieData.isSubscription === "Expired") {
      return res.status(409).json({ status: 409, message: "Payment not done, so this profile cannot be published." });
    }

    // Convert isPublish from the request to match the database format
    const requestedIsPublish = isPublish === true || isPublish === "true" || isPublish === 1;

    if (requestedIsPublish === academieData.isPublish) {
      return res.status(409).json({ status: 409, message: "Status not changed. It is already set to the same value." });
    }

    // Update isPublish and isActive fields
    await academieData.update({ isPublish: requestedIsPublish, isActive: true });

    return res.status(200).json({ status: 200, message: "Status updated successfully." });
  } catch (error) {
    console.error("Athlete change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error." });
  }
};
// Aprove status controller
exports.academieIsApprove = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { isApprove } = req.body;

    console.log("userId", userId, "isApprove", isApprove);
    const userData = await userModel.findOne({ where: { id: userId } });
    console.log("userData", userData);

    if (!userData) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const academieData = await academieModel.findOne({ where: { id: userData?.profileInfo } });
    console.log("academieData", academieData);

    if (!academieData) {
      return res.status(404).json({ status: 404, message: "Academie not found" });
    }

    await academieData.update({ isApprove });

    if (isApprove === "Pending") {
      return res.status(200).json({ status: 200, message: "Pending status updated" });
    } else if (isApprove === "Reject") {
      return res.status(200).json({ status: 200, message: "Reject status updated" });
    } else { // If approved
      const newPassword = generatePassword(12); // Generate a password
      console.log("newPassword", newPassword);

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user password
      await userModel.update({ password: hashedPassword }, { where: { id: userId } });

      // Send email with the new password
      const recordType = "Academies & clubs";
      const email = userData.email;
      const { subject, content } = generateEmailContent(recordType, email, newPassword);
      await sendEmail(email, subject, content);

      return res.status(200).json({ status: 200, message: "Approve status updated" });
    }
  } catch (error) {
    console.error("Academie change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
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
}
// generate email content
function generateEmailContent (recordType, email, password) {
  const subject = `Welcome to ${recordType} Portal`;
  const content = `<p>Hello ${recordType},</p>
  <p>Your account has been created successfully</p>.
  <p>Email: ${email}</p>
  <p>Password: ${password}</p>
  <p>Thank you for joining!</p>.`;
  return { subject, content };
}
// Generate email for admin
function generateEmailContentForAdmin (recordType, firstName, lastName, email) {
  const subject = `New ${recordType} Added`;
  const content = `<p>Hi admin,</p>
    <p>A new ${recordType} has been added:</p>
    <p>First Name: ${firstName}</p>
    <p>Last Name: ${lastName}</p>
    <p>Email: ${email}</p>
    <p>Please check and verify.</p>`;
  return { subject, content };
}
