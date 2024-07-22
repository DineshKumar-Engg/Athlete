const sequelize = require("sequelize");
const database = require("../../utills/database");
const user = require("../../models/user/userModel");
const role = require("../../models/role/roleModel");
const message = database.define( "message",
  {
    id: {
      type: sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: sequelize.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);
user.hasMany(message, { foreignKey: "senderId" });
user.hasMany(message, { foreignKey: "receiverId" }); // new
message.belongsTo(user, { foreignKey: "senderId" }); // new
message.belongsTo(user, { foreignKey: "receiverId" });
role.hasMany(message, { foreignKey: "roleId" });
module.exports = message;
