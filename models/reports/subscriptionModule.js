const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const subscription = database.define("subscription", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  subscriptionName: {
    type: sequelize.STRING,
    allowNull: false
  },
  description: {
    type: sequelize.STRING,
    allowNull: false
  },
  subscriptionAmount: {
    type: sequelize.STRING,
    allowNull: false
  },
  subscriptionLimit: {
    type: sequelize.STRING,
    allowNull: false,
    defaultValue: 0
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
  },
  subscribtionStatus: {
    type: sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  paranoid: true
});
subscription.belongsTo(user, { foreignKey: "createdUser" });
subscription.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = subscription;
