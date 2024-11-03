const cors = require("cors");
const sequelize = require("./db");
const subdomainCheck = require("./middleware/subdomainCheck");

module.exports = (app) => {
  // Setup CORS
  app.use(
    cors({
      origin: "*", // Can be customized for production 'https://helpdesk.asucapstonetools.com'
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // Enable this for sessions/auth
    })
  );

  // Set up subdomain check middleware
  app.use(subdomainCheck);

  // Setup JSON parsing middleware
  app.use(require("express").json());

  // Setup database connection
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected...");
      return sequelize.sync(); // Syncs models with the database
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
};
