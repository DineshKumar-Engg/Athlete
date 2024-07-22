const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const athlete = database.define("athlete", {
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
  gender: {
    type: sequelize.STRING,
    allowNull: false
  },
  grade: {
    type: sequelize.STRING,
    allowNull: false
  },
  city: {
    type: sequelize.STRING,
    allowNull: false
  },
  residentialState: {
    type: sequelize.STRING,
    allowNull: false
  },
  school: {
    type: sequelize.STRING,
    allowNull: false
  },
  bio: {
    type: sequelize.STRING,
    allowNull: false
  },
  achievements: {
    type: sequelize.STRING,
    allowNull: false
  },
  parentFirstName: {
    type: sequelize.STRING,
    allowNull: false
  },
  parentLastName: {
    type: sequelize.STRING,
    allowNull: false
  },
  parentEmail: {
    type: sequelize.STRING,
    allowNull: false
  },
  parentPhone: {
    type: sequelize.STRING,
    allowNull: false
  },
  parentConsent: {
    type: sequelize.BOOLEAN,
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
  athleteSpecialty: {
    type: sequelize.STRING,
    allowNull: false
  },
  currentAcademie: {
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
athlete.belongsTo(user, { foreignKey: "createdUser" });
athlete.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = athlete;
