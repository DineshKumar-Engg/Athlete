const sendEmail = require("../../middlewares/nodeMailer");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const userModel = require("../../models/user/userModel");
const coachModel = require("../../models/coach/coachModel");
const sportModel = require("../../models/common/sportsModel");
const roleModel = require("../../models/role/roleModel");
const galleryModel = require("../../models/gallery/galleryModel");
const citiesModel = require("../../models/cities/citiesModel");
const statesModel = require("../../models/states/statesModel");
const athleteModel = require("../../models/athlete/athleteModel");
const subscriptionModel = require("../../models/reports/subscriptionModule");
const specialityModel = require("../../models/speciality/specialityModel");
exports.adminAddCoach = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      profileImg,
      age,
      gender,
      bio,
      city,
      achievements,
      state,
      instagramLink,
      websiteLink,
      twitterLink,
      ageYouCoach,
      lookingFor,
      coachSpecialty,
      genderYouCoach,
      sportsId
    } = req.body;

    console.log("Request body data:", req.body);

    // Check if coach with the same email already exists
    const existingUser = await userModel.findOne({ where: { email } });
    console.log("existingUser", existingUser);
    if (existingUser) {
      return res.status(409).json({ status: 409, message: "User already exists" });
    }
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
      roleId: 3
    });

    // Create a new admin
    const newCoach = await coachModel.create({
      age,
      phone,
      gender,
      bio,
      city,
      achievements,
      state,
      instagramLink,
      twitterLink,
      websiteLink,
      sportsId,
      ageYouCoach,
      genderYouCoach,
      lookingFor,
      coachSpecialty,
      isApprove: "Pending",
      isPublish: false,
      isActive: false,
      isSubscription: "Active",
      roleId: 3
    });

    const reqUserId = req.user.id;

    // Check if req.user.id is valid
    if (!reqUserId) {
      return res.status(401).json({ status: 401, message: "Unauthorized user" });
    }

    await newUser.update({
      profileInfo: newCoach.id,
      createdUser: req.user.id,
      updatedUser: req.user.id
    });

    await newCoach.update({
      createdUser: req.user.id,
      updatedUser: req.user.id,
      userId: newUser.id
    });
    if (newUser && newCoach) {
      // Generate email content
      // const recordType = "Coach";
      // const { subject, content } = generateEmailContent(
      //   recordType,
      //   email,
      //   password
      // );

      // await sendEmail(email, subject, content);

      return res.status(201).json({ status: 201, message: "Coach added successfully", data: newUser });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Error occurred while adding coach" });
    }
  } catch (error) {
    console.error("Add coach API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.registerCoach = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      profileImg,
      age,
      phone,
      gender,
      bio,
      city,
      achievements,
      state,
      ageYouCoach,
      genderYouCoach,
      instagramLink,
      twitterLink,
      websiteLink,
      lookingFor,
      coachSpecialty,
      sportsId
    } = req.body;
    console.log("Request body data:", req.body);

    // Check if coach with the same email already exists
    const existingUser = await userModel.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ status: 409, message: "User already exists" });
    }

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
      roleId: 3
    });

    // Create a new coach
    const newCoach = await coachModel.create({
      age,
      phone,
      gender,
      bio,
      city,
      achievements,
      state,
      instagramLink,
      twitterLink,
      websiteLink,
      sportsId,
      ageYouCoach,
      genderYouCoach,
      coachSpecialty,
      lookingFor,
      isApprove: "Pending",
      isPublish: false,
      isActive: false,
      isSubscription: "Active",
      roleId: 3
    });

    await newUser.update({
      profileInfo: newCoach.id,
      createdUser: newUser.id,
      updatedUser: newUser.id
    });

    await newCoach.update({
      createdUser: newUser.id,
      updatedUser: newUser.id,
      userId: newUser.id
    });

    if (newUser && newCoach) {
      // Generate email content
      const recordType = "Coach";
      const { subject, content } = generateEmailContentForAdmin(
        recordType,
        firstName,
        lastName,
        email
      );

      // Send email to admin
      const adminEmail = process.env.ADMIN_EMAIL;
      await sendEmail(adminEmail, subject, content);

      return res.status(200).json({ status: 200, message: "Coach added successfully" });
    } else {
      return res.status(500).json({ status: 500, message: "Error occurred while adding coach" });
    }
  } catch (error) {
    console.log("Delete Coach API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Delete coach
exports.deleteCoach = async (req, res, next) => {
  try {
    const coachId = req.params.id;
    console.log("deleteId", coachId);

    // Find the user associated with the coach
    const userData = await userModel.findOne({ where: { id: coachId, roleId: 3 } });
    console.log("userDataInfo", userData);

    // If user not found, return 401
    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    const userDelete = await userModel.destroy(
      {
        where: {
          id: coachId
        }
      }
    );
    console.log("userDelete", userDelete);

    const coachDelete = await coachModel.destroy(
      {
        where: {
          id: userData?.profileInfo
        }
      }
    );

    // Check if any rows were affected
    if (userDelete > 0 || coachDelete > 0) {
      return res.status(200).json({ status: 200, message: "Coach deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Coach not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Coach API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Update Coach
exports.updateCoach = async (req, res, next) => {
  try {
    const userId = req.body.id;
    console.log("Request body data:", req.body);

    // const userData = await userModel.findByPk(athleteId);
    const userData = await userModel.findOne({ where: { id: userId, roleId: 3 } });
    console.log("userDataInfo", userData);
    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    const coachId = userData?.profileInfo;
    const coachData = await coachModel.findByPk(coachId);

    console.log("coachData", coachData);
    console.log("existingUser", userData);

    if (userData && coachData) {
      let count = 0;
      const {
        firstName,
        lastName,
        email,
        profileImg,
        age,
        phone,
        gender,
        bio,
        city,
        achievements,
        state,
        instagramLink,
        twitterLink,
        websiteLink,
        ageYouCoach,
        genderYouCoach,
        coachSpecialty,
        sportsId,
        isApprove,
        lookingFor,
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
      if (age && age !== coachData.age) {
        await coachData.update({ age });
        count++;
      }
      if (gender && gender !== coachData.gender) {
        await coachData.update({ gender });
        count++;
      }
      if (city && city !== coachData.city) {
        await coachData.update({ city });
        count++;
      }
      if (bio && bio !== coachData.bio) {
        await coachData.update({ bio });
        count++;
      }
      if (achievements && achievements !== coachData.achievements) {
        await coachData.update({ achievements });
        count++;
      }
      if (state && state !== coachData.state) {
        await coachData.update({ state });
        count++;
      }
      if (instagramLink && instagramLink !== coachData.instagramLink) {
        await coachData.update({ instagramLink });
        count++;
      }
      if (twitterLink && twitterLink !== coachData.twitterLink) {
        await coachData.update({ twitterLink });
        count++;
      }
      if (websiteLink && websiteLink !== coachData.websiteLink) {
        await coachData.update({ websiteLink });
        count++;
      }
      if (sportsId && sportsId !== coachData.sportsId) {
        await coachData.update({ sportsId });
        count++;
      }
      if (ageYouCoach && ageYouCoach !== coachData.ageYouCoach) {
        await coachData.update({ ageYouCoach });
        count++;
      }
      if (genderYouCoach && genderYouCoach !== coachData.genderYouCoach) {
        await coachData.update({ genderYouCoach });
        count++;
      }
      if (coachSpecialty && coachSpecialty !== coachData.coachSpecialty) {
        await coachData.update({ coachSpecialty });
        count++;
      }
      if (lookingFor && lookingFor !== coachData.lookingFor) {
        await coachData.update({ lookingFor });
        count++;
      }
      if (phone && phone !== coachData.phone) {
        await coachData.update({ phone });
        count++;
      }
      if (isActive && isActive !== coachData.isActive) {
        await coachData.update({ isActive });
        count++;
      }
      if (isApprove && isApprove !== coachData.isApprove) {
        await coachData.update({ isApprove });
        count++;
      }
      if (isPublish && isPublish !== coachData.isPublish) {
        await coachData.update({ isPublish });
        count++;
      }
      if (isSubscription && isSubscription !== coachData.isSubscription) {
        await coachData.update({ isSubscription });
        count++;
      }
      if (count > 0) {
        await userData.update({ updatedUser: req?.user?.id });
        await coachData.update({ updatedUser: req?.user?.id });

        return res.status(200).json({ status: 200, message: "Data updates successfully", data: userData });
      } else {
        return res.status(200).json({ status: 200, message: "Nothing is changes" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
  } catch (error) {
    console.log("Delete coach API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Coach get all data
exports.getAllCoach = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    if (req.user.roleId !== 1) {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }

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

exports.getCoach = async (req, res, next) => {
  try {
    const coachId = req.params.id;
    console.log("coachId", coachId);

    // Fetch user data
    const userData = await userModel.findOne({ attributes: { exclude: ["password"] }, where: { id: coachId, roleId: 3 } });
    console.log("userData", userData);

    if (!userData) {
      return res.status(404).json({ status: 404, message: "Coach not found" });
    }

    // Fetch coach data
    const coachData = await coachModel.findOne({ where: { id: userData.profileInfo } });
    console.log("coachData", coachData);

    if (!coachData) {
      return res.status(404).json({ status: 404, message: "Coach profile not found" });
    }

    // Fetch role data
    const roleData = await roleModel.findOne({ where: { id: userData.roleId } });
    console.log("roleData", roleData);

    if (!roleData) {
      return res.status(404).json({ status: 404, message: "Role not found for this coach" });
    }

    // Fetch gallery data
    const galleryData = await galleryModel.findAll({ where: { userId: coachId } });
    console.log("galleryData", galleryData);
    // Parse and filter state and city IDs from coachData
    const stateIds = coachData.state.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const cityIds = coachData.city.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
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
    const sportIds = coachData.sportsId.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const sportData = await sportModel.findAll({ where: { id: { [Op.in]: sportIds } } });
    console.log("sportData", sportData);
    const specialityIds = coachData.coachSpecialty.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const specialityData = await specialityModel.findAll({ where: { id: { [Op.in]: specialityIds } } });
    return res.status(200).json({ status: 200, message: "Success", data: { userData, coachData, stateData, citiesData, roleData, sportData, specialityData, galleryData } });
  } catch (error) {
    console.error("Get coach API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// status change controller
exports.coachIsPublish = async (req, res, next) => {
  try {
    const coachId = req.params.id;
    const { isPublish } = req.body;

    console.log("coachId:", coachId, "isPublish:", isPublish);

    const coachData = await coachModel.findOne({ where: { id: coachId, roleId: 3 } });
    console.log("coachData:", coachData);

    if (!coachData) {
      return res.status(404).json({ status: 404, message: "Coach Not found" });
    }

    if (coachData.isApprove === "Pending" || coachData.isApprove === "Reject") {
      return res.status(409).json({ status: 409, message: "Profile approvel not done, so this profile cannot be published." });
    }

    // Convert isPublish from the request to match the database format
    const requestedIsPublish = isPublish === true || isPublish === "true" || isPublish === 1;

    if (requestedIsPublish === coachData.isPublish) {
      return res.status(409).json({ status: 409, message: "Status not changed. It is already set to the same value." });
    }

    // Update isPublish and isActive fields
    await coachData.update({ isPublish: requestedIsPublish, isActive: true, isSubscription: "Active" });

    return res.status(200).json({ status: 200, message: "Status updated successfully." });
  } catch (error) {
    console.error("Athlete change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error." });
  }
};

// Aprove status controller
exports.coachIsApprove = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { isApprove } = req.body;

    console.log("userId", userId, "isApprove", isApprove);
    const userData = await userModel.findOne({ where: { id: userId } });
    console.log("userData", userData);

    if (!userData) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const coachData = await coachModel.findOne({ where: { id: userData?.profileInfo } });
    console.log("coachData", coachData);

    if (!coachData) {
      return res.status(404).json({ status: 404, message: "Coach not found" });
    }

    await coachData.update({ isApprove });

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
      const recordType = "Coach";
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

// exports.searchAthlete = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;

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
//     if (req.query.age && req.query.age !== "0") {
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
//     whereClause.isPublish = 1;
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
exports.searchAthlete = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

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
    whereClause.isPublish = 1;
    whereClause.isApprove = "Approve";
    whereClause.isSubscription = "Active";
    whereClause.isActive = 1;
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
// function generateEmailContentForAdmin (recordType, adminEmail, firstName, lastName, email) {
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
