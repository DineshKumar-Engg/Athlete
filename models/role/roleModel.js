const Sequelize = require("sequelize");
const sequelize = require("../../utills/database");

const role = sequelize.define("role", {
  id: {
    type: Sequelize.INTEGER,
    allowNul: false,
    autoIncrement: true,
    primaryKey: true
  },
  roleName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  roleDescription: {
    type: Sequelize.STRING,
    allowNull: false
  },
  roleType: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdUser: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  updatedUser: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = role;
