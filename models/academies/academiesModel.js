const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const academies = database.define("academies", {
  id: {
    type: sequelize.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  academieName: {
    type: sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: sequelize.STRING,
    allowNull: false
  },
  title: {
    type: sequelize.STRING,
    allowNull: false
  },
  bio: {
    type: sequelize.STRING,
    allowNull: false
  },
  city: {
    type: sequelize.STRING,
    allowNull: false
  },
  state: {
    type: sequelize.STRING,
    allowNull: false
  },
  instagramLink: {
    type: sequelize.STRING,
    allowNull: false
  },
  twitterLink: {
    type: sequelize.STRING,
    allowNull: false
  },
  websiteLink: {
    type: sequelize.STRING,
    allowNull: false
  },
  leagueName: {
    type: sequelize.STRING,
    allowNull: false
  },
  ageYouCoach: {
    type: sequelize.STRING,
    allowNull: false
  },
  genderYouCoach: {
    type: sequelize.STRING,
    allowNull: false
  },
  sportsId: {
    type: sequelize.STRING,
    allowNull: true
  },
  isApprove: {
    type: sequelize.STRING,
    allowNull: false
  },
  isPublish: {
    type: sequelize.BOOLEAN,
    allowNull: false
  },
  isSubscription: {
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
academies.belongsTo(user, { foreignKey: "createdUser" });
academies.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = academies;
