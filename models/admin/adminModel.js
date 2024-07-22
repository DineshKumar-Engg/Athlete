const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const admin = database.define("admin", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  }
});
admin.belongsTo(user, { foreignKey: "createdUser" });
admin.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = admin;
