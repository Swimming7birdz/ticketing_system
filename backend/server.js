const express = require("express");
const dotenv = require("dotenv");
const os = require("os");
const path = require("path");

// const FRONTEND_BUILD_PATH = path.join(__dirname, "../frontend/build"); // PUT INTO ENV VARS PLEASE

// Load environment variables
dotenv.config();

const app = express();

// Load setup for middleware and database
require("./config/setup")(app);

// Load routes
require("./routes")(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD_PATH, "index.html"));
});

const PORT = process.env.PORT || 3000;
const HOSTNAME = os.hostname();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});
