const cron = require("node-cron");
const { Op } = require("sequelize");
// const moment = require("moment");

const userModel = require("../models/user/userModel");
const athleteModel = require("../models/athlete/athleteModel");
const academieModel = require("../models/academies/academiesModel");
const transactionHistoryModel = require("../models/transaction/transactionHistoryModel");
const subscriptionModel = require("../models/reports/subscriptionModule");
// Schedule the cron job to run at midnight every day
cron.schedule("0 0 * * *", async () => {
// cron.schedule("*/2 * * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    console.log("Today:", today);
  
    // Fetch transaction histories with active plans
    const transactionHistoryData = await transactionHistoryModel.findAll({
      where: {
        deletedAt: { [Op.is]: null },
        startDate: { [Op.lte]: today },
        endDate: { [Op.gte]: today },
      },
      include: [
        {
          model: userModel,
          as: "user",
          required: true,
        },
        {
          model: subscriptionModel,
          as: "subscription",
          required: true,
        },
      ],
    });
  
    // Process each transaction history record
    for (const txn of transactionHistoryData) {
      const { user } = txn;
      const { profileInfo, roleId } = user;
  
      if (today >= txn.startDate && today <= txn.endDate) {
        // The subscription is currently active
        // No action needed for active subscriptions
      } else if (today > txn.endDate) {
        // The subscription has expired
        if (roleId === 2) {
          // Update athleteModel
          await athleteModel.update(
            { isSubscription: "Expired" },
            { where: { id: profileInfo } }
          );
        } else if (roleId === 4) {
          // Update academieModel
          await academieModel.update(
            { isSubscription: "Expired" },
            { where: { id: profileInfo } }
          );
        }
  
        // Optionally, you can also update the user's subscription status in the userModel
        // await userModel.update(
        //   { isSubscription: "Expired" },
        //   { where: { id: user.id } }
        // );
      }
    }
  
    console.log("Cron job executed successfully");
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
});
  