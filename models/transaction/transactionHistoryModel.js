const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const transactionhistory = database.define("transactionhistory", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  totalAmount: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  taxAmount: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  taxPercentage: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  subtotalAmount: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  discount: {
    type: sequelize.STRING,
    allowNull: false
  },
  paymentTransactionId: {
    type: sequelize.STRING,
    allowNull: true
  },
  modeOfPayment: {
    type: sequelize.STRING,
    allowNull: true
  },
  paymentStatus: {
    type: sequelize.STRING,
    allowNull: false
  },
  startDate: {
    type: sequelize.STRING,
    allowNull: false
  },
  endDate: {
    type: sequelize.STRING,
    allowNull: false
  },
  // newly added on 10-05-2024
  subscriptionName: {
    type: sequelize.STRING,
    allowNull: false
  },
  subscriptionMonth: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  processingTax: {
    type: sequelize.STRING,
    allowNull: false
  },
  convenienceTax: {
    type: sequelize.STRING,
    allowNull: false
  },
  serviceTax: {
    type: sequelize.STRING,
    allowNull: false
  }
}, {
  paranoid: true
});
transactionhistory.belongsTo(user, { foreignKey: "createdUser" });
transactionhistory.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = transactionhistory;
