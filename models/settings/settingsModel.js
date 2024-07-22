const sequelize = require("sequelize");
const database = require("../../utills/database");

const setting = database.define("setting", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  appName: {
    type: sequelize.STRING,
    allowNull: false
  },
  fromAge: {
    type: sequelize.STRING,
    allowNull: false
  },
  toAge: {
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
  youtubeLink: {
    type: sequelize.STRING,
    allowNull: false
  },
  facebookLink: {
    type: sequelize.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: sequelize.STRING,
    allowNull: false
  },
  email: {
    type: sequelize.STRING,
    allowNull: false
  },
  appIntroduction: {
    type: sequelize.TEXT("medium"),
    allowNull: false
  }
}, {
  paranoid: true
});
module.exports = setting;
