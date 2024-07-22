const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const gallery = database.define("gallery", {
  id: {
    type: sequelize.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  description: {
    type: sequelize.STRING,
    allowNull: false
  },
  fileLocation: {
    type: sequelize.STRING,
    allowNull: false
  },
  isActive: {
    type: sequelize.BOOLEAN,
    allowNull: false
  },
  fileType: {
    type: sequelize.STRING,
    allowNull: false
  },
  isApproved: {
    type: sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  paranoid: true
});
gallery.belongsTo(user, { foreignKey: "createdUser" });
gallery.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = gallery;
