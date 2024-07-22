const sequelize = require("sequelize");
const database = require("../../utills/database");

const contact = database.define("contact", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  firstname: {
    type: sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: sequelize.STRING,
    allowNull: false
  },
  email: {
    type: sequelize.STRING,
    allowNull: false
  },
  message: {
    type: sequelize.STRING,
    allowNull: false
  }
});
module.exports = contact;
