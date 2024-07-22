const sequelize = require("sequelize");
const database = require("../../utills/database");
const favorite = database.define("favorite", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  isLiked: {
    type: sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: true
  }
});
// admin.belongsTo(user, { foreignKey: "createdUser" });
module.exports = favorite;
