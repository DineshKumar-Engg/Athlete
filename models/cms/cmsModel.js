const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const cms = database.define("cms", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  metaTitle: {
    type: sequelize.TEXT("medium"),
    allowNull: false
  },
  metaDescription: {
    type: sequelize.TEXT("medium"),
    allowNull: false
  },
  metaKeywords: {
    type: sequelize.TEXT("medium"),
    allowNull: false
  },
  title: {
    type: sequelize.TEXT("medium"),
    allowNull: false
  },
  content: {
    type: sequelize.TEXT("long"),
    allowNull: false
  },
  isPublish: {
    type: sequelize.BOOLEAN,
    allowNull: false
  }
},
{
  paranoid: true
}
);
cms.belongsTo(user, { foreignKey: "createdUser" });
cms.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = cms;
