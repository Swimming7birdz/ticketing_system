const cors = require("cors");
const sequelize = require("./db");
const express = require("express");

const httplogger = require("../middleware/httplogger");

const path = require("path");
const FRONTEND_BUILD_PATH = path.join(__dirname, "../../frontend/build");

module.exports = (app) => {
  // Setup CORS
  app.use(
    cors({
      origin: "*", // Can be customized for production 'https://helpdesk.asucapstonetools.com'
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // Enable this for sessions/auth
    })
  );

  // Set up httplogger
  app.use(httplogger);

  // Setup JSON parsing middleware
  app.use(require("express").json());

  // Setup the backend to serve the front end
  app.use(express.static(FRONTEND_BUILD_PATH));

  // Fallback route for React Router
  app.get("*", (req, res) => {
    res.sendFile(path.join(FRONTEND_BUILD_PATH, "index.html"));
  });

  //Setup database connection
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
