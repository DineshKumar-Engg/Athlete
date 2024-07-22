const userModel = require("../../models/user/userModel");
const transactionHistoryModel = require("../../models/transaction/transactionHistoryModel");
const athleteModel = require("../../models/athlete/athleteModel");
// const coachModel = require("../../models/coach/coachModel");
const academieModel = require("../../models/academies/academiesModel");
const subscriptionModel = require("../../models/reports/subscriptionModule");
const { Op } = require("sequelize");

const calculateSubscriptionDates = async (subscriptionMonth, userId) => {
  const historyCount = await transactionHistoryModel.findOne({
    where: { userId },
    attributes: ["startDate", "endDate"],
    order: [["createdAt", "DESC"]]
  });
  console.log("historyCount", historyCount);

  let startDate, endDate;
  let today = new Date();
  console.log("today", today);
  if (!historyCount) { // Check if historyCount is an empty array
    
    const subscriptionEndDate = new Date(today);

    // Add subscription months to the end date
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + subscriptionMonth);
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() - 1); // End of the last day of the subscription

    startDate = today.toISOString().split("T")[0];
    endDate = subscriptionEndDate.toISOString().split("T")[0];

    console.log("startDate", startDate);
    console.log("endDate", endDate);
  } else {
    const latestEndDate = new Date(historyCount.endDate);
    const latestStartDate = new Date(historyCount.startDate);
    if (latestEndDate < today) {
      const subscriptionEndDate = new Date(today);
  
      // Add subscription months to the end date
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + subscriptionMonth);
      subscriptionEndDate.setDate(subscriptionEndDate.getDate() - 1); // End of the last day of the subscription
  
      startDate = today.toISOString().split("T")[0];
      endDate = subscriptionEndDate.toISOString().split("T")[0];
  
      console.log("startDate", startDate);
      console.log("endDate", endDate);
    } else if (latestStartDate <= today && today <= latestEndDate) {
      const newStartDate = new Date(latestEndDate);
      newStartDate.setDate(newStartDate.getDate() + 1); // Start date is the day after the latest end date
      const subscriptionEndDate = new Date(newStartDate);
  
      // Add subscription months to the end date
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + subscriptionMonth);
      subscriptionEndDate.setDate(subscriptionEndDate.getDate() - 1); // End of the last day of the subscription
  
      startDate = newStartDate.toISOString().split("T")[0];
      endDate = subscriptionEndDate.toISOString().split("T")[0];
  
      console.log("startDate", startDate);
      console.log("endDate", endDate);
    } else {
      console.log("Above any condition not matched");
    }
  }

  return { startDate, endDate };
};

exports.createCardPayment = async (req, res, next) => {
  try {
    const id = req.user.id;
    const {
      totalAmount,
      taxAmount,
      taxPercentage,
      subtotalAmount,
      discount,
      paymentTransactionId,
      modeOfPayment,
      paymentStatus,
      subscriptionName,
      subscriptionMonth,
      subscriptionId,
      serviceTax,
      convenienceTax,
      processingTax,
      promocodeId,
      userId
    } = req.body;

    console.log("req.body", req.body);

    // Fetch user data
    const userData = await userModel.findOne({ where: { id } });
    console.log("userData", userData);

    if (!userData) {
      return res.status(401).json({ status: 401, message: "Not authorized" });
    }

    // Fetch subscription data
    const subscriptionData = await subscriptionModel.findOne({ where: { id: subscriptionId } });
    console.log("subscriptionData", subscriptionData);

    // Count transaction history
    const transactionHistoryCount = await transactionHistoryModel.count({ where: { subscriptionId: subscriptionData.id } });
    console.log("transactionHistoryCount", transactionHistoryCount);

    // Check subscription limit
    if (subscriptionData.subscriptionLimit !== "unlimited" && Number(subscriptionData.subscriptionLimit) <= transactionHistoryCount) {
      return res.status(400).json({ status: 400, message: "Subscription access limit expired" });
    }

    // Calculate subscription dates
    const { startDate, endDate } = await calculateSubscriptionDates(subscriptionData.subscriptionMonth, id);

    // Create payment transaction
    const paymentCreate = await transactionHistoryModel.create({
      totalAmount,
      taxAmount,
      taxPercentage,
      subtotalAmount,
      discount,
      paymentTransactionId,
      modeOfPayment,
      paymentStatus,
      startDate,
      endDate,
      subscriptionId,
      subscriptionName,
      subscriptionMonth,
      serviceTax,
      convenienceTax,
      processingTax,
      promocodeId,
      userId,
      roleId: userData.roleId,
      createdUser: userData.id,
      updatedUser: userData.id
    });

    // Handle payment creation success
    if (paymentCreate) {
      // console.log("Status", paymentStatus);
      // const profileData = await getProfileData(userData.roleId, userData.profileInfo);
      // if (paymentStatus === "Succeeded") {
      //   await profileData.update({ isSubscription: "Active", subscriptionId });
      // } else if (paymentStatus === "Incomplete") {
      //   await profileData.update({ isSubscription: "Inactive", subscriptionId });
      // } else {
      //   await profileData.update({ isSubscription: "Expired", subscriptionId });
      // }
      return res.status(201).json({ status: 201, message: "Payment Created" });
    } else {
      return res.status(404).json({ status: 404, message: "Payment Failed" });
    }
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Function to get profile data based on role
// const getProfileData = async (roleId, profileInfo) => {
//   let profileData;
//   switch (roleId) {
//   case 2: // Athlete role
//     profileData = await athleteModel.findOne({ where: { id: profileInfo } });
//     break;
//   case 3: // Coach role
//     profileData = await coachModel.findOne({ where: { id: profileInfo } });
//     break;
//   case 4: // Academie role
//     profileData = await academieModel.findOne({ where: { id: profileInfo } });
//     break;
//   default:
//     throw new Error("Role not matched");
//   }
//   console.log("profileData", profileData);
//   return profileData;
// };


exports.getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    if (!userId) {
      return res.status(400).json({ status: 400, message: "User ID is required" });
    }

    const existingUser = await userModel.findOne({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    // let profileData;
    // if (existingUser.roleId === 2) {
    //   profileData = await athleteModel.findOne({ where: { id: existingUser.profileInfo } });
    // } else if (existingUser.roleId === 4) {
    //   profileData = await academieModel.findOne({ where: { id: existingUser.profileInfo } });
    // } else {
    //   return res.status(404).json({ status: 404, message: "Role not matched" });
    // }

    // const subscriptionData = await subscriptionModel.findOne({ where: { id: profileData.subscriptionId } });
    // if (!subscriptionData) {
    //   return res.status(404).json({ status: 404, message: "Subscription data not found" });
    // }

    const transactionData = await transactionHistoryModel.findAll({ where: { userId }, include:[{model: subscriptionModel}], order: [["createdAt", "DESC"]]  });
    // res.status(200).json({ status: 200, message: "Success", data: { existingUser, profileData, subscriptionData, transactionData } });
    res.status(200).json({ status: 200, message: "Success", transactionData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getTransactionHistorySingle = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const transactionData = await transactionHistoryModel.findAll({ where: { id }, order: [["createdAt", "DESC"]] });
    res.status(200).json({ status: 200, message: "Success", transactionData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getCurrentTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    if (!userId) {
      return res.status(400).json({ status: 400, message: "User ID is required" });
    }

    const existingUser = await userModel.findOne({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    let profileData;
    if (existingUser.roleId === 2) {
      profileData = await athleteModel.findOne({ where: { id: existingUser.profileInfo }, attributes: ["subscriptionId"] });
    } else if (existingUser.roleId === 4) {
      profileData = await academieModel.findOne({ where: { id: existingUser.profileInfo }, attributes: ["subscriptionId"] });
    } else {
      return res.status(404).json({ status: 404, message: "Role not found" });
    }

    if (!profileData || !profileData.subscriptionId) {
      return res.status(404).json({ status: 404, message: "Profile data or subscription ID not found" });
    }

    const today = new Date().toISOString().split("T")[0];
    console.log("today", today);

    // Log the profile data and subscription ID
    console.log("profileData", profileData);
    console.log("subscriptionId", profileData.subscriptionId);

    // Log the expected query conditions
    console.log("Query Conditions", {
      subscriptionId: profileData.subscriptionId,
      userId,
      startDate: { [Op.lte]: today },
      endDate: { [Op.gte]: today }
    });

    const transactionHistoryData = await transactionHistoryModel.findAll({
      where: {
        subscriptionId: profileData.subscriptionId,
        userId,
        startDate: { [Op.lte]: today },
        endDate: { [Op.gte]: today }
      },
      include: [{ model: subscriptionModel }],
      logging: console.log
    });

    console.log("transactionHistoryData", transactionHistoryData);

    if (!transactionHistoryData || transactionHistoryData.length === 0) {
      return res.status(404).json({ status: 404, message: "No transaction history found for today" });
    }

    return res.status(200).json({ status: 200, message: "Success", data: transactionHistoryData });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};