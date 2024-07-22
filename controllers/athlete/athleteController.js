const sendEmail = require("../../middlewares/nodeMailer");
const bcrypt = require("bcrypt");
const athleteModel = require("../../models/athlete/athleteModel");
const userModel = require("../../models/user/userModel");
const subscriptionModel = require("../../models/reports/subscriptionModule");
const sportModel = require("../../models/common/sportsModel");
const roleModel = require("../../models/role/roleModel");
const galleryModel = require("../../models/gallery/galleryModel");
const citiesModel = require("../../models/cities/citiesModel");
const statesModel = require("../../models/states/statesModel");
const coachModel = require("../../models/coach/coachModel");
const academiesModel = require("../../models/academies/academiesModel");
const specialityModel = require("../../models/speciality/specialityModel");
// const transactionHistoryModel = require("../../models/transaction/transactionHistoryModel");
const { Op } = require("sequelize");
exports.adminAddAthlete = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      profileImg,
      age,
      gender,
      city,
      residentialState,
      school,
      bio,
      grade,
      achievements,
      parentFirstName,
      parentLastName,
      parentEmail,
      parentPhone,
      parentConsent,
      instagramLink,
      twitterLink,
      athleteSpecialty,
      currentAcademie,
      sportsId,
      subscriptionId
    } = req.body;

    console.log("Request body data:", req.body);

    // Check if athlete with the same email already exists
    const existingUser = await userModel.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ status: 400, message: "User already exists" });
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
        profileInfo: 2,
        roleId: 2
      });

      // Create a new athlete
      const newAthlete = await athleteModel.create({
        age,
        gender,
        bio,
        city,
        grade,
        achievements,
        residentialState,
        school,
        parentFirstName,
        parentLastName,
        parentEmail,
        parentPhone,
        parentConsent,
        instagramLink,
        twitterLink,
        athleteSpecialty,
        currentAcademie,
        sportsId,
        subscriptionId,
        isApprove: "Pending",
        isPublish: false,
        isActive: false,
        isSubscription: "Inactive",
        roleId: 2
      });

      const reqUserId = req.user.id;

      // Check if req.user.id is valid
      if (!reqUserId) {
        return res.status(401).json({ status: 401, message: "Unauthorized user" });
      }

      // Update the user and athlete with the correct IDs
      await newUser.update({
        profileInfo: newAthlete.id,
        createdUser: req.user.id,
        updatedUser: req.user.id
      });

      await newAthlete.update({
        createdUser: req.user.id,
        updatedUser: req.user.id,
        userId: newUser.id
      });

      // Generate email content and send email
      // const recordType = "Athlete";
      // const { subject, content } = generateEmailContent(
      //   recordType,
      //   email,
      //   password
      // );

      // await sendEmail(email, subject, content);

      return res.status(201).json({ status: 201, message: "Athlete added successfully", data: newUser });
    } catch (error) {
      // Handle specific errors related to athlete creation
      console.error("Add athlete API error:", error);

      return res.status(500).json({ status: 500, message: "Internal server error" });
    }
  } catch (error) {
    // Handle other errors
    console.error("Add athlete API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Register Athlete
exports.registerAthlete = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      profileImg,
      age,
      gender,
      city,
      residentialState,
      school,
      bio,
      grade,
      achievements,
      parentFirstName,
      parentLastName,
      parentEmail,
      parentPhone,
      parentConsent,
      instagramLink,
      twitterLink,
      athleteSpecialty,
      currentAcademie,
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
        profileInfo: 2,
        roleId: 2
      });

      // Create a new athlete
      const newAthlete = await athleteModel.create({
        age,
        gender,
        bio,
        city,
        achievements,
        residentialState,
        school,
        grade,
        parentFirstName,
        parentLastName,
        parentEmail,
        parentPhone,
        parentConsent,
        instagramLink,
        twitterLink,
        athleteSpecialty,
        currentAcademie,
        sportsId,
        subscriptionId,
        isApprove: "Pending",
        isPublish: false,
        isActive: false,
        isSubscription: "Inactive",
        roleId: 2
      });

      // Update the user and athlete with the correct IDs
      await newUser.update({
        profileInfo: newAthlete.id,
        createdUser: newUser.id,
        updatedUser: newUser.id
      });

      await newAthlete.update({
        createdUser: newUser.id,
        updatedUser: newUser.id,
        userId: newUser.id
      });

      // Generate email content for admin
      const recordType = "Athlete";
      const { subject, content } = generateEmailContentForAdmin(
        recordType,
        firstName,
        lastName,
        email
      );

      // Send email to admin
      const adminEmail = process.env.ADMIN_EMAIL;
      await sendEmail(adminEmail, subject, content);

      return res.status(201).json({ status: 201, message: "Athlete added successfully" });
    } catch (error) {
      // Handle specific errors related to athlete creation here

      console.error("Add athlete API error:", error);
      return res.status(500).json({ status: 500, message: "Internal server error" });
    }
  } catch (error) {
    // Handle other errors here

    console.error("Add athlete API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Delete Athlete
exports.deleteAthlete = async (req, res, next) => {
  try {
    const athleteId = req.params.id;
    console.log("deleteId", athleteId);

    const userData = await userModel.findOne({ where: { id: athleteId, roleId: 2 } });
    console.log("userDataInfo", userData);

    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    const userDelete = await userModel.destroy(
      {
        where: { id: athleteId }
      }
    );
    console.log("userDelete", userDelete);

    const athleteDelete = await athleteModel.destroy(
      {
        where: { id: userData?.profileInfo }
      }
    );

    // Check if any rows were affected
    if (userDelete > 0 || athleteDelete > 0) {
      return res.status(200).json({ status: 200, message: "Athlete deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Athlete not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Athlete API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Update athlete
exports.updateAthlete = async (req, res, next) => {
  try {
    const userId = req.body.id;
    console.log("Request body data:", req.body);

    // const userData = await userModel.findByPk(athleteId);
    const userData = await userModel.findOne({ where: { id: userId, roleId: 2 } });
    console.log("userDataInfo", userData);
    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    const athleteId = userData?.profileInfo;
    const athleteData = await athleteModel.findByPk(athleteId);

    console.log("athleteData", athleteData);
    console.log("existingUser", userData);

    if (userData && athleteData) {
      let count = 0;
      const {
        firstName,
        lastName,
        email,
        profileImg,
        age,
        gender,
        bio,
        city,
        grade,
        achievements,
        residentialState,
        school,
        parentFirstName,
        parentLastName,
        parentEmail,
        parentPhone,
        parentConsent,
        instagramLink,
        twitterLink,
        athleteSpecialty,
        currentAcademie,
        sportsId,
        subscriptionId,
        isApprove,
        isPublish,
        isSubscription,
        isActive
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
      if (age && age !== athleteData.age) {
        await athleteData.update({ age });
        count++;
      }
      if (gender && gender !== athleteData.gender) {
        await athleteData.update({ gender });
        count++;
      }
      if (city && city !== athleteData.city) {
        await athleteData.update({ city });
        count++;
      }
      if (bio && bio !== athleteData.bio) {
        await athleteData.update({ bio });
        count++;
      }
      if (achievements && achievements !== athleteData.achievements) {
        await athleteData.update({ achievements });
        count++;
      }
      if (residentialState && residentialState !== athleteData.residentialState) {
        await athleteData.update({ residentialState });
        count++;
      }
      if (instagramLink && instagramLink !== athleteData.instagramLink) {
        await athleteData.update({ instagramLink });
        count++;
      }
      if (twitterLink && twitterLink !== athleteData.twitterLink) {
        await athleteData.update({ twitterLink });
        count++;
      }
      if (sportsId && sportsId !== athleteData.sportsId) {
        await athleteData.update({ sportsId });
        count++;
      }
      if (school && school !== athleteData.school) {
        await athleteData.update({ school });
        count++;
      }
      if (parentFirstName && parentFirstName !== athleteData.parentFirstName) {
        await athleteData.update({ parentFirstName });
        count++;
      }
      if (parentLastName && parentLastName !== athleteData.parentLastName) {
        await athleteData.update({ parentLastName });
        count++;
      }
      if (parentEmail && parentEmail !== athleteData.parentEmail) {
        await athleteData.update({ parentEmail });
        count++;
      }
      if (parentPhone && parentPhone !== athleteData.parentPhone) {
        await athleteData.update({ parentPhone });
        count++;
      }
      if (parentConsent && parentConsent !== athleteData.parentConsent) {
        await athleteData.update({ parentConsent });
        count++;
      }
      if (subscriptionId && subscriptionId !== athleteData.subscriptionId) {
        await athleteData.update({ subscriptionId });
        count++;
      }
      if (grade && grade !== athleteData.grade) {
        await athleteData.update({ grade });
        count++;
      }
      if (athleteSpecialty && athleteSpecialty !== athleteData.athleteSpecialty) {
        await athleteData.update({ athleteSpecialty });
        count++;
      }
      if (currentAcademie && currentAcademie !== athleteData.currentAcademie) {
        await athleteData.update({ currentAcademie });
        count++;
      }
      if (isActive && isActive !== athleteData.isActive) {
        await athleteData.update({ isActive });
        count++;
      }
      if (isApprove && isApprove !== athleteData.isApprove) {
        await athleteData.update({ isApprove });
        count++;
      }
      if (isPublish && isPublish !== athleteData.isPublish) {
        await athleteData.update({ isPublish });
        count++;
      }
      if (isSubscription && isSubscription !== athleteData.isSubscription) {
        await athleteData.update({ isSubscription });
        count++;
      }
      if (count > 0) {
        await userData.update({ updatedUser: req?.user?.id });
        await athleteData.update({ updatedUser: req?.user?.id });

        return res.status(200).json({ status: 200, message: "Data updates successfully", data: userData });
      } else {
        return res.status(200).json({ status: 200, message: "Nothing is changed" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
  } catch (error) {
    console.log("Delete athlete API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// exports.getAllAthlete = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;

//     if (req.user.roleId !== 1) {
//       return res.status(401).json({ status: 401, message: "Not Authorized" });
//     }

//     const citiesData = await citiesModel.findAll();
//     const stateData = await statesModel.findAll();
//     const specialityData = await specialityModel.findAll();
//     const sportData = await sportModel.findAll();

//     const cityMap = {};
//     citiesData.forEach(city => {
//       cityMap[city.id] = city;
//     });

//     const stateMap = {};
//     stateData.forEach(state => {
//       stateMap[state.id] = state;
//     });

//     const specialityMap = {};
//     specialityData.forEach(speciality => {
//       specialityMap[speciality.id] = speciality;
//     });

//     const sportMap = {};
//     sportData.forEach(sport => {
//       sportMap[sport.id] = sport;
//     });

//     const whereClause = {};

//     if (req.query.age) {
//       const isAgeRange = req.query.age.includes("+");
//       if (isAgeRange) {
//         const minAge = parseInt(req.query.age);
//         whereClause.age = { [Op.gte]: minAge };
//       } else {
//         whereClause.age = parseInt(req.query.age);
//       }
//     }
//     if (req.query.gender && req.query.gender !== "0") {
//       whereClause.gender = req.query.gender;
//     }
//     if (req.query.city && req.query.city !== "0") {
//       whereClause.city = { [Op.like]: `%${req.query.city}%` };
//     }
//     if (req.query.residentialState && req.query.residentialState !== "0") {
//       whereClause.residentialState = { [Op.like]: `%${req.query.residentialState}%` };
//     }
//     if (req.query.sportsId && req.query.sportsId !== "0") {
//       const sports = req.query.sportsId.split(",").map(id => parseInt(id, 10));
//       whereClause.sportsId = { [Op.in]: sports };
//     }
//     if (req.query.isPublish) {
//       whereClause.isPublish = req.query.isPublish;
//     }
//     if (req.query.isSubscription) {
//       whereClause.isSubscription = req.query.isSubscription;
//     }

//     const allAthletes = await athleteModel.findAll({
//       where: whereClause,
//       include: [
//         {
//           model: userModel,
//           attributes: { exclude: ["password"] },
//           include: [
//             {
//               model: galleryModel
//             }
//           ]
//         },
//         {
//           model: subscriptionModel
//         }
//       ],
//       limit,
//       offset
//     });

//     const formattedAthletes = allAthletes.map(athlete => {
//       const athleteData = athlete.toJSON();
//       athleteData.cityData = cityMap[athleteData.city] || null;
//       athleteData.stateData = stateMap[athleteData.residentialState] || null;

//       if (athleteData.athleteSpecialty) {
//         const specialityIds = athleteData.athleteSpecialty.split(",").map(id => parseInt(id));
//         athleteData.specialities = specialityIds.map(id => specialityMap[id]).filter(Boolean);
//       } else {
//         athleteData.specialities = [];
//       }

//       if (athleteData.sportsId) {
//         const sportIds = athleteData.sportsId.split(",").map(id => parseInt(id));
//         athleteData.sports = sportIds.map(id => sportMap[id]).filter(Boolean);
//       } else {
//         athleteData.sports = [];
//       }

//       return athleteData;
//     });

//     return res.status(200).json({ status: 200, message: "Success", data: formattedAthletes });
//   } catch (error) {
//     console.error("Get all athlete API error:", error);
//     return res.status(500).json({ status: 500, message: "Internal server error" });
//   }
// };
exports.getAllAthlete = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    if (req.user.roleId !== 1) {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }

    const citiesData = await citiesModel.findAll();
    const stateData = await statesModel.findAll();
    const specialityData = await specialityModel.findAll();
    const sportData = await sportModel.findAll();

    const cityMap = {};
    citiesData.forEach(city => {
      cityMap[city.id] = city;
    });

    const stateMap = {};
    stateData.forEach(state => {
      stateMap[state.id] = state;
    });

    const specialityMap = {};
    specialityData.forEach(speciality => {
      specialityMap[speciality.id] = speciality;
    });

    const sportMap = {};
    sportData.forEach(sport => {
      sportMap[sport.id] = sport;
    });

    const whereClause = {};

    if (req.query.age) {
      const isAgeRange = req.query.age.includes("+");
      if (isAgeRange) {
        const minAge = parseInt(req.query.age);
        whereClause.age = { [Op.gte]: minAge };
      } else {
        const ages = req.query.age.split(",").map(age => parseInt(age, 10));
        whereClause.age = { [Op.in]: ages };
      }
    }

    if (req.query.gender && req.query.gender !== "0") {
      const genders = req.query.gender.split(",");
      whereClause.gender = { [Op.in]: genders };
    }

    if (req.query.city && req.query.city !== "0") {
      const cities = req.query.city.split(",").map(city => `%${city}%`);
      whereClause.city = { [Op.or]: cities.map(city => ({ [Op.like]: city })) };
    }

    if (req.query.residentialState && req.query.residentialState !== "0") {
      const states = req.query.residentialState.split(",").map(state => `%${state}%`);
      whereClause.residentialState = { [Op.or]: states.map(state => ({ [Op.like]: state })) };
    }

    if (req.query.sportsId && req.query.sportsId !== "0") {
      const sports = req.query.sportsId.split(",").map(id => parseInt(id, 10));
      whereClause.sportsId = { [Op.or]: sports.map(id => ({ [Op.like]: `%${id}%` })) };
    }

    if (req.query.isPublish) {
      whereClause.isPublish = req.query.isPublish;
    }

    if (req.query.isSubscription) {
      whereClause.isSubscription = req.query.isSubscription;
    }

    const allAthletes = await athleteModel.findAll({
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
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    const formattedAthletes = allAthletes.map(athlete => {
      const athleteData = athlete.toJSON();
      athleteData.cityData = cityMap[athleteData.city] || null;
      athleteData.stateData = stateMap[athleteData.residentialState] || null;

      if (athleteData.athleteSpecialty) {
        const specialityIds = athleteData.athleteSpecialty.split(",").map(id => parseInt(id));
        athleteData.specialities = specialityIds.map(id => specialityMap[id]).filter(Boolean);
      } else {
        athleteData.specialities = [];
      }

      if (athleteData.sportsId) {
        const sportIds = athleteData.sportsId.split(",").map(id => parseInt(id));
        athleteData.sports = sportIds.map(id => sportMap[id]).filter(Boolean);
      } else {
        athleteData.sports = [];
      }

      return athleteData;
    });

    return res.status(200).json({ status: 200, message: "Success", data: formattedAthletes });
  } catch (error) {
    console.error("Get all athlete API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// get Athlete details
exports.getAthlete = async (req, res, next) => {
  try {
    const athleteId = req.params.id;

    // Fetch user data
    const userData = await userModel.findOne({ attributes: { exclude: ["password"] }, where: { id: athleteId, roleId: 2 } });
    if (!userData) {
      return res.status(404).json({ status: 404, message: "Athlete not found" });
    }

    // Fetch athlete data
    const athleteData = await athleteModel.findOne({ where: { id: userData.profileInfo } });
    if (!athleteData) {
      return res.status(404).json({ status: 404, message: "Athlete profile not found" });
    }

    // Fetch role data
    const roleData = await roleModel.findOne({ where: { id: userData.roleId } });
    if (!roleData) {
      return res.status(404).json({ status: 404, message: "Role not found for this athlete" });
    }

    // Fetch subscription data
    const subscriptionData = await subscriptionModel.findOne({ where: { id: athleteData.subscriptionId } });

    // Fetch transactionData data
    // const transactionData = await transactionHistoryModel.findAll({ where: { subscriptionId: subscriptionData?.id } });
    // console.log("transactionDataa", transactionData);
    const stateData = await statesModel.findOne({ where: { id: athleteData?.residentialState } });
    const citiesData = await citiesModel.findOne({ where: { id: athleteData?.city } });
    // Fetch gallery data
    const galleryData = await galleryModel.findAll({ where: { userId: athleteId } });
    console.log("galleryData", galleryData);

    // Fetch sport data
    const sportIds = athleteData.sportsId.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const sportData = await sportModel.findAll({ where: { id: { [Op.in]: sportIds } } });

    const specialityIds = athleteData.athleteSpecialty.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const specialityData = await specialityModel.findAll({ where: { id: { [Op.in]: specialityIds } } });
    return res.status(200).json({ status: 200, message: "Success", data: { userData, athleteData, stateData, citiesData, roleData, sportData, specialityData, subscriptionData, galleryData } });
  } catch (error) {
    console.error("Get athlete API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// status change controller
exports.athleteIsPublish = async (req, res, next) => {
  try {
    const athleteId = req.params.id;
    const { isPublish } = req.body;

    console.log("athleteId:", athleteId, "isPublish:", isPublish);

    const athleteData = await athleteModel.findOne({ where: { id: athleteId, roleId: 2 } });
    console.log("athleteData:", athleteData);

    if (!athleteData) {
      return res.status(404).json({ status: 404, message: "Athlete not found" });
    }

    if (athleteData.isSubscription === "Inactive" || athleteData.isSubscription === "Expired") {
      return res.status(409).json({ status: 409, message: "Payment not done, so this profile cannot be published." });
    }

    // Convert isPublish from the request to match the database format
    const requestedIsPublish = isPublish === true || isPublish === "true" || isPublish === 1;

    if (requestedIsPublish === athleteData.isPublish) {
      return res.status(409).json({ status: 409, message: "Status not changed. It is already set to the same value." });
    }

    // Update isPublish and isActive fields
    await athleteData.update({ isPublish: requestedIsPublish, isActive: true });

    return res.status(200).json({ status: 200, message: "Status updated successfully." });
  } catch (error) {
    console.error("Athlete change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error." });
  }
};
// Aprove status controller
exports.athleteIsApprove = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { isApprove } = req.body;

    console.log("userId", userId, "isApprove", isApprove);
    const userData = await userModel.findOne({ where: { id: userId } });
    console.log("userData", userData);

    if (!userData) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const athleteData = await athleteModel.findOne({ where: { id: userData?.profileInfo } });
    console.log("athleteData", athleteData);

    if (!athleteData) {
      return res.status(404).json({ status: 404, message: "Athlete not found" });
    }

    await athleteData.update({ isApprove });

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
      const recordType = "Athlete";
      const email = userData.email;
      const { subject, content } = generateEmailContent(recordType, email, newPassword);
      await sendEmail(email, subject, content);

      return res.status(200).json({ status: 200, message: "Approve status updated" });
    }
  } catch (error) {
    console.error("Athlete change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Search API's
exports.searchCoach = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Fetch all cities, states, specialties, and sports
    const citiesData = await citiesModel.findAll();
    const stateData = await statesModel.findAll();
    const specialityData = await specialityModel.findAll();
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

    const specialityMap = {};
    specialityData.forEach(speciality => {
      specialityMap[speciality.id] = speciality;
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
    if (req.query.coachSpecialty && req.query.coachSpecialty !== "0") {
      const specialityIds = req.query.coachSpecialty.split(",").map(id => parseInt(id, 10));
      whereClause.coachSpecialty = { [Op.or]: specialityIds.map(id => ({ [Op.like]: `%${id}%` })) };
    }
    if (req.query.genderYouCoach && req.query.genderYouCoach !== "0") {
      const genders = req.query.genderYouCoach.split(",").map(gender => gender.trim());
      whereClause.genderYouCoach = { [Op.or]: genders.map(gender => ({ [Op.like]: `%${gender}%` })) };
    }
    if (req.query.ageYouCoach && req.query.ageYouCoach !== "0") {
      const ageValues = req.query.ageYouCoach.split(",").map(age => parseInt(age.trim()));
      whereClause.ageYouCoach = { [Op.or]: ageValues.map(age => ({ [Op.like]: `%${age}%` })) };
    }
    // published data only show front-end
    whereClause.isPublish = 1;
    whereClause.isApprove = "Approve";
    whereClause.isActive = 1;
    // Fetch data based on the constructed query
    const allCoaches = await coachModel.findAll({
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
        }
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });
    // Add full city, state, specialty, and sport objects to the response data
    const formattedCoaches = allCoaches.map(coach => {
      const coachData = coach.toJSON();

      // Parse city and map to cityData
      if (coachData.city && typeof coachData.city === "string") {
        const cityIds = coachData.city.split(",").map(id => parseInt(id));
        coachData.citiesData = cityIds.map(id => cityMap[id]).filter(Boolean);
      } else {
        coachData.citiesData = [];
      }

      // Parse state and map to stateData
      if (coachData.state && typeof coachData.state === "string") {
        const stateIds = coachData.state.split(",").map(id => parseInt(id));
        coachData.stateData = stateIds.map(id => stateMap[id]).filter(Boolean);
      } else {
        coachData.stateData = [];
      }

      // Parse coachSpecialty and map to specialityData
      if (coachData.coachSpecialty && typeof coachData.coachSpecialty === "string") {
        const specialityIds = coachData.coachSpecialty.split(",").map(id => parseInt(id));
        coachData.specialities = specialityIds.map(id => specialityMap[id]).filter(Boolean);
      } else {
        coachData.specialities = [];
      }

      // Parse sportsId and map to sportData
      if (coachData.sportsId && typeof coachData.sportsId === "string") {
        const sportIds = coachData.sportsId.split(",").map(id => parseInt(id));
        coachData.sports = sportIds.map(id => sportMap[id]).filter(Boolean);
      } else {
        coachData.sports = [];
      }

      return coachData;
    });
    return res.status(200).json({ status: 200, message: "Success", data: formattedCoaches });
  } catch (error) {
    console.error("Get all coach API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Search API's
exports.searchAcademies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
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
    // Construct req.query.sportId && req.query.sportId !== "0"query parameters for filtering
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
    if (req.query.genderYouCoach && req.query.genderYouCoach !== "0") {
      const genders = req.query.genderYouCoach.split(",").map(gender => gender.trim());
      whereClause.genderYouCoach = { [Op.or]: genders.map(gender => ({ [Op.like]: `%${gender}%` })) };
    }
    if (req.query.ageYouCoach && req.query.ageYouCoach !== "0") {
      const ageValues = req.query.ageYouCoach.split(",").map(age => parseInt(age.trim()));
      whereClause.ageYouCoach = { [Op.or]: ageValues.map(age => ({ [Op.like]: `%${age}%` })) };
    }

    // published data only show front-end
    whereClause.isPublish = 1;
    whereClause.isApprove = "Approve";
    whereClause.isSubscription = "Active";
    whereClause.isActive = 1;
    // Fetch data based on the constructed query
    const allAcademies = await academiesModel.findAll({
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
        }
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });
    // Add full city, state, specialty, and sport objects to the response data
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
    console.error("Get all coach API error:", error);
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
