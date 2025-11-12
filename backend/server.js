// //For Production
// const express = require("express");
// const dotenv = require("dotenv");
// const os = require("os");
// const path = require("path");


// // Directory for the built frontend assets
// const FRONTEND_BUILD_PATH = path.join(__dirname, "../frontend/build");


// // Load environment variables from .env
// dotenv.config();


// const app = express();
// //temp changes made by adi for no-cahche global middleware for all resposnses
// //Production
// app.use((req, res, next) => {
//        res.setHeader("Cache-Control","no-store, no-cache, must-revalidate, max-age=0");
//        res.setHeader("Pragma", "no-cache");
//        res.setHeader("Expires","0");
//        next();
// });


// app.use(express.static(FRONTEND_BUILD_PATH));   //changes made by Adi to try to test for caching, Production
// // Load setup for middleware and database
// require("./config/setup")(app);


// // Register API routes
// require("./routes")(app);


// // Serve the frontend for any non‑API request
// app.get("*", (req, res) => {
//  res.sendFile(path.join(FRONTEND_BUILD_PATH, "index.html"));
// });


// const PORT = process.env.PORT || 3000; //Production
// const HOSTNAME = os.hostname();


// app.listen(PORT, () => {
//  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
// });

//For Development
const express = require("express");
const dotenv = require("dotenv");
const os = require("os");
const path = require("path");

// Directory for the built frontend assets
const FRONTEND_BUILD_PATH = path.join(__dirname, "../frontend/build");

// Load environment variables from .env
dotenv.config();

const app = express();

// Configure middleware and database
require("./config/setup")(app);

// Register API routes
require("./routes")(app);

// Serve the frontend for any non‑API request
app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD_PATH, "index.html"));
});

// Bind the server to the desired port (use 3301 by default for local development)
const PORT = process.env.PORT || 3301;
const HOSTNAME = os.hostname();

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});