const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: console.log, // Logs SQL queries for debugging (remove in production)
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This is important for some cloud providers
    }
  }
});

module.exports = sequelize;