const sequelize = require("sequelize");
const database = require("../../utills/database");

const speciality = database.define("speciality", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  specialityTitle: {
    type: sequelize.STRING,
    allowNull: false
  }
}, {
  paranoid: true
});
module.exports = speciality;
