const express = require("express");
const dotenv = require("dotenv");
const os = require("os");

// Load environment variables
dotenv.config();

const app = express();

// Load setup for middleware and database
require("./config/setup")(app);

// Load routes
require("./routes")(app);

const PORT = process.env.PORT || 3000;
const HOSTNAME = os.hostname();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});
