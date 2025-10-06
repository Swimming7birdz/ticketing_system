const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configure Sequelize for a local Postgres database.
// Force SSL off when running locally; remove or override in production as needed.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: console.log, // Logs SQL queries for debugging (remove in production)
  ssl: false,
});

module.exports = sequelize;
