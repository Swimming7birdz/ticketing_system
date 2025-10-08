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
