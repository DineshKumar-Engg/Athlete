const sequelize = require("sequelize");
const database = require("../../utills/database");
const cmsgallery = database.define("cmsgallery", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  fileLocation: {
    type: sequelize.STRING,
    allowNull: true
  },
  fileType: {
    type: sequelize.STRING,
    allowNull: true
  },
  fileTitle: {
    type: sequelize.TEXT("medium"),
    allowNull: true
  },
  fileDescription: {
    type: sequelize.TEXT("long"),
    allowNull: true
  }
},
{
  paranoid: true
}
);
module.exports = cmsgallery;
