const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const coach = database.define("coach", {
  id: {
    type: sequelize.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  age: {
    type: sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: sequelize.STRING,
    allowNull: false
  },
  gender: {
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
  achievements: {
    type: sequelize.STRING,
    allowNull: false
  },
  lookingFor: {
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
  coachSpecialty: {
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
coach.belongsTo(user, { foreignKey: "createdUser" });
coach.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = coach;
