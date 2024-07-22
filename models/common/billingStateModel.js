const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const billingstate = database.define("billingstate", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  stateName: {
    type: sequelize.STRING,
    allowNull: false
  },
  tax: {
    type: sequelize.STRING,
    allowNull: false
  },
  isActive: {
    type: sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  paranoid: true
});
billingstate.belongsTo(user, { foreignKey: "createdUser" });
billingstate.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = billingstate;
