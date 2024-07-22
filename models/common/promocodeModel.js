const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../user/userModel");
const promocode = database.define("promocode", {
  id: {
    type: sequelize.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  promocodeName: {
    type: sequelize.STRING,
    allowNull: false
  },
  promocodeDescription: {
    type: sequelize.STRING,
    allowNull: false
  },
  startDate: {
    type: sequelize.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: sequelize.DATEONLY,
    allowNull: false
  },
  discount: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  accessLimit: {
    type: sequelize.STRING,
    allowNull: false
  },
  isEnable: {
    type: sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  paranoid: true
});

promocode.belongsTo(user, { foreignKey: "createdUser" });
promocode.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = promocode;
