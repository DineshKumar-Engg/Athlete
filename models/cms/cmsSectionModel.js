const sequelize = require("sequelize");
const database = require("../../utills/database");
const cmssection = database.define("cmssection", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: sequelize.TEXT("medium"),
    allowNull: true
  },
  shortDescription: {
    type: sequelize.TEXT("medium"),
    allowNull: true
  },
  description: {
    type: sequelize.TEXT("long"),
    allowNull: true
  }
},
{
  paranoid: true
}
);
module.exports = cmssection;
