const cors = require("cors");
const sequelize = require("./db");

module.exports = (app) => {
  // Setup CORS
  app.use(
    cors({
      origin: "*", // Can be customized for production
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // Enable this for sessions/auth
    })
  );

  // Setup JSON parsing middleware
  app.use(require("express").json());

  // Connect to the database
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected...");
      return sequelize.sync();
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
};
