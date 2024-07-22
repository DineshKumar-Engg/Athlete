const subscriptionModel = require("../../models/reports/subscriptionModule");
const userModel = require("../../models/user/userModel");
const sportModel = require("../../models/common/sportsModel");
const athleteModel = require("../../models/athlete/athleteModel");
const academieModel = require("../../models/academies/academiesModel");
const roleModel = require("../../models/role/roleModel");
exports.addSubscription = async (req, res, next) => {
  try {
    const {
      subscriptionName,
      description,
      subscriptionAmount,
      subscriptionLimit,
      subscribtionStatus,
      processingTax,
      convenienceTax,
      serviceTax,
      subscriptionMonth,
      // sportId,
      roleId
    } = req.body;
    console.log("Request Body:", req.body);
    console.log("User:", req.user);

    const existingUser = await userModel.findOne({
      where: { email: req?.user?.email, roleId: 1 }
    });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(409).json({ status: 409, message: "User not found" });
    }

    const existingSubscription = await subscriptionModel.findOne({
      where: { subscriptionName }
    });

    if (existingSubscription) {
      return res.status(409).json({ status: 409, message: "Subscription with the same name already exists" });
    }

    try {
      const newSubscription = await subscriptionModel.create({
        subscriptionName,
        description,
        subscriptionAmount,
        subscriptionLimit,
        subscribtionStatus,
        processingTax,
        convenienceTax,
        serviceTax,
        subscriptionMonth,
        // sportId,
        roleId
      });
      await newSubscription.update({
        createdUser: existingUser?.createdUser,
        updatedUser: existingUser?.updatedUser
      });
      if (newSubscription) {
        return res.status(200).json({ status: 200, message: "Subscription added successfully" });
      } else {
        return res.status(400).json({ status: 400, message: "Subscription creation failed" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, message: "Error occurred while adding sport" });
    }
  } catch (error) {
    console.error("Add sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Delete athlete
exports.deleteSubscription = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;
    console.log("subscriptionId", subscriptionId);
    const result = await subscriptionModel.destroy({
      where: {
        id: subscriptionId
      }
    });
    if (result > 0) {
      return res.status(200).json({ status: 200, message: "Subscription deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Subscription not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Subscription API error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

// Admin get all data
exports.getAllSubscriptions = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    console.log("roleId", roleId);

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    if (!req.query.page && !req.query.limit) {
      page = 1;
      limit = 20;
    }

    const offset = (page - 1) * limit;
    let allSubscriptions;

    const userData = await userModel.findOne({ where: { id: req.user.id } });
    let roleData;
    if (roleId === 1) {
      // Admin: Retrieve all subscriptions
      allSubscriptions = await subscriptionModel.findAll({
        limit,
        offset,
        include: [{ model: roleModel }],
        order: [["createdAt", "DESC"]] 
      });
    } else if (roleId === 2) {
      roleData = await athleteModel.findOne({ where: { id: userData?.profileInfo } });
      console.log("role", roleData);
      if (roleData && roleData.roleId) {
        allSubscriptions = await subscriptionModel.findAll({
          where: { subscribtionStatus: true, roleId: roleData.roleId },
          limit,
          offset,
          include: [{ model: roleModel }]
        });
      } else {
        allSubscriptions = [];
      }
    } else if (roleId === 4) {
      // Non-admin: Retrieve subscriptions for the sports associated with the user
      const roleData = await academieModel.findOne({ where: { id: userData?.profileInfo } });
      console.log("academieSport", roleData);
      if (roleData && roleData.roleId) {
        allSubscriptions = await subscriptionModel.findAll({
          where: { subscribtionStatus: true, roleId: roleData.roleId },
          limit,
          offset,
          include: [{ model: roleModel }]
        });
      } else {
        allSubscriptions = [];
      }
    } else {
      return res.status(403).json({ status: 403, message: "Forbidden" });
    }

    return res.status(200).json({ status: 200, message: "Success", data: allSubscriptions });
  } catch (error) {
    console.error("Get all sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Update Subscriptions
exports.updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.body.id;
    console.log("userId", userId, "subscriptionId", subscriptionId);
    const userData = await userModel.findOne({ where: { id: userId, roleId: 1 } });
    console.log("userDataInfo", userData);

    if (!userData) {
      return res.status(409).json({ status: 409, message: "User not found" });
    }

    const subscriptionData = await subscriptionModel.findOne({
      where: { id: subscriptionId }
    });
    console.log("subscriptionData", subscriptionData);
    if (userData && subscriptionData) {
      let count = 0;
      const {
        subscriptionName,
        description,
        subscriptionAmount,
        subscriptionLimit,
        processingTax,
        convenienceTax,
        serviceTax,
        subscriptionMonth,
        subscribtionStatus
      } = req.body;
      if (
        subscriptionName &&
        subscriptionName !== subscriptionData.subscriptionName
      ) {
        await subscriptionData.update({ subscriptionName });
        count++;
      }
      if (description && description !== subscriptionData.description) {
        await subscriptionData.update({ description });
        count++;
      }
      if (
        subscriptionAmount &&
        subscriptionAmount !== subscriptionData.subscriptionAmount
      ) {
        await subscriptionData.update({ subscriptionAmount }
        );
        count++;
      }
      if (
        subscriptionLimit && subscriptionLimit !== subscriptionData.subscriptionLimit
      ) {
        await subscriptionData.update({ subscriptionLimit }
        );
        count++;
      }
      if (
        subscribtionStatus && subscribtionStatus !== subscriptionData.subscribtionStatus
      ) {
        await subscriptionData.update({ subscribtionStatus });
        count++;
      }
      if (processingTax && processingTax !== subscriptionData.processingTax) {
        await subscriptionData.update({ processingTax });
        count++;
      }
      if (
        convenienceTax && convenienceTax !== subscriptionData.convenienceTax
      ) {
        await subscriptionData.update({ convenienceTax });
        count++;
      }
      if (serviceTax && serviceTax !== subscriptionData.serviceTax) {
        await subscriptionData.update({ serviceTax });
        count++;
      }
      if (subscriptionMonth && subscriptionMonth !== subscriptionData.subscriptionMonth) {
        await subscriptionData.update({ subscriptionMonth });
        count++;
      }
      if (count > 0) {
        await subscriptionData.update({ updatedUser: userData.id }
        );

        return res
          .status(200).json({ status: 200, message: "Data updates successfully" });
      } else {
        return res
          .status(200).json({ status: 200, message: "Nothing is changed" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
  } catch (error) {
    console.log("Update sport API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.singleSubscription = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;
    const role = req.user.roleId;
    console.log("subscriptionId", subscriptionId, "role", role);

    let subscriptionData;

    if (role === 1) {
      subscriptionData = await subscriptionModel.findOne({ where: { id: subscriptionId }, include: [{ model: roleModel }] });
    } else {
      subscriptionData = await subscriptionModel.findOne({ where: { id: subscriptionId, subscribtionStatus: true }, include: [{ model: roleModel }] });
    }

    if (subscriptionData) {
      console.log("subscriptionData", subscriptionData);
      return res.status(200).json({ status: 200, message: "Success", data: subscriptionData });
    } else {
      return res.status(400).json({ status: 400, message: "Data not found" });
    }
  } catch (error) {
    console.error("Error in singleSport:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.sportSubscription = async (req, res, next) => {
  try {
    const sportId = req.params.sportid;
    console.log("Sport Id:", sportId);
    const subscriptionData = await subscriptionModel.findAll({
      where: { sportId },
      include: [{ model: sportModel }, { model: roleModel }]
    });
    if (subscriptionData.length === 0) {
      return res.status(404).json({ status: 404, message: "Data not found" });
    }
    return res.status(200).json({ status: 200, message: "Success", data: subscriptionData });
  } catch (error) {
    console.error("Error retrieving sport subscription:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// status change controller
exports.subscribtionIsActive = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;
    const { subscribtionStatus } = req.body;

    console.log("subscriptionId", subscriptionId, "subscribtionStatus", subscribtionStatus);

    const subscriptionData = await subscriptionModel.findOne({ where: { id: subscriptionId } });
    console.log("subscriptionData", subscriptionData);

    if (!subscriptionData) {
      return res.status(404).json({ status: 404, message: "Athlete not found" });
    }
    const requestedIsActive = subscribtionStatus === true || subscribtionStatus === "true" || subscribtionStatus === 1;

    if (requestedIsActive === subscriptionData.subscribtionStatus) {
      return res.status(409).json({ status: 409, message: "Status not changed. It's already set to the same value." });
    }

    // Convert requestedIsActive back to database format before updating
    await subscriptionData.update({ subscribtionStatus: requestedIsActive ? 1 : 0 }, { where: { id: subscriptionId } });

    return res.status(200).json({ status: 200, message: "Status updated successfully" });
  } catch (error) {
    console.error("Athlete change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// User status change controller
exports.subscribtionIsSubscription = async (req, res, next) => {
  try {
    const { userId, subscriptionId } = req.body;

    console.log("userId", userId, "subscriptionId", subscriptionId);
    
    const userData = await userModel.findOne({ where: { id: userId } });
    console.log("userData", userData);
    if (!userData) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    if (userData.roleId === 2) {
      const athleteUpdate = await athleteModel.update(
        { isSubscription: "Active", subscriptionId },
        { where: { id: userData.profileInfo } }
      );
      console.log("athleteUpdate", athleteUpdate, );
    } else if (userData.roleId === 4) {
      const academieUpdate = await academieModel.update(
        { isSubscription: "Active", subscriptionId },
        { where: { id: userData.profileInfo } }
      );
      console.log("academieUpdate", academieUpdate );
    }
   
    return res.status(200).json({ status: 200, message: "Status updated successfully" });
  } catch (error) {
    console.error("Athlete change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

