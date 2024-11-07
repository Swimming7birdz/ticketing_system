// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DATABASE_NAME,
//   process.env.DATABASE_USER,
//   process.env.DATABASE_PASS,
//   {
//     host: process.env.DATABASE_HOST,
//     port: process.env.DATABASE_PORT,
//     dialect: "mysql",
//     //logging: console.log, // Optional: logs SQL queries for debugging; remove in production
//   }
// );

// module.exports = sequelize;

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: console.log, // Logs SQL queries for debugging (remove in production)
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // This is important for some cloud providers
    },
  },
});

module.exports = sequelize;
