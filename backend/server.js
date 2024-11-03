const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Load setup for middleware and database
require("./config/setup")(app);

// Load routes
require("./routes")(app);

const PORT = process.env.PORT || 3002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
