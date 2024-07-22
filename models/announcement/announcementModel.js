const sequelize = require("sequelize");
const database = require("../../utills/database");

const announcement = database.define("announcement", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  announcementTitle: {
    type: sequelize.STRING,
    allowNull: false
  },
  announcementDescription: {
    type: sequelize.TEXT("medium"),
    allowNull: false
  },
  sportsId: {
    type: sequelize.STRING,
    allowNull: true
  },
  fromDate: {
    type: sequelize.STRING,
    allowNull: true
  },
  toDate: {
    type: sequelize.STRING,
    allowNull: true
  }
}, {
  paranoid: true
});
module.exports = announcement;