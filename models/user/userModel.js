const sequelize = require("sequelize");
const database = require("../../utills/database");

const user = database.define("user", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: sequelize.STRING,
    allowNull: false
  },
  email: {
    type: sequelize.STRING,
    allowNull: false
  },
  password: {
    type: sequelize.STRING,
    allowNull: false
  },
  profileImg: {
    type: sequelize.STRING,
    allowNull: false
  },
  profileInfo: {
    type: sequelize.INTEGER,
    allowNull: false
  }
}, {
  paranoid: true
});
user.belongsTo(user, { foreignKey: "createdUser" });
user.belongsTo(user, { foreignKey: "updatedUser" });
module.exports = user;
