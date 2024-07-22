const Sequelize = require ("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.HOST_URL,
    port: 3306,  
    alter: true // Enable auto-migration 
  }
);

const connectDataBase = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectDataBase();
module.exports = sequelize; 
