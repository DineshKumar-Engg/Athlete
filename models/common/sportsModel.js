const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const sport = database.define("sport", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  sportName: {
    type: sequelize.STRING,
    allowNull: false
  },
  sportDescription: {
    type: sequelize.STRING,
    allowNull: false
  },
  // sportLogoId: {
  //   type: sequelize.INTEGER,
  //   allowNull: false
  // },
  sportLogo: {
    type: sequelize.STRING,
    allowNull: true
  },
  isActive: {
    type: sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  paranoid: true // Enable soft deletion for this model
});
sport.belongsTo(user, { foreignKey: "createdUser" });
sport.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = sport;
