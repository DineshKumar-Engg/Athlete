const sequelize = require("sequelize");
const database = require("../../utills/database");
const cities = database.define("cities", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: sequelize.STRING,
    allowNull: false
  },
  stateId: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  stateCode: {
    type: sequelize.STRING,
    allowNull: false
  },
  stateName: {
    type: sequelize.STRING,
    allowNull: false
  },
  countryId: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  countryCode: {
    type: sequelize.STRING,
    allowNull: false
  },
  countryName: {
    type: sequelize.STRING,
    allowNull: false
  },
  latitude: {
    type: sequelize.STRING,
    allowNull: false
  },
  longitude: {
    type: sequelize.STRING,
    allowNull: false
  },
  wikiDataId: {
    type: sequelize.STRING,
    allowNull: false
  }
}, {
  paranoid: true
});
module.exports = cities;
