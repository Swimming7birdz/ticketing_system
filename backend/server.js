const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const communicationRoutes = require("./routes/communicationRoutes");
const authRoutes = require("./routes/authRoutes");
const teamMemberRoutes = require("./routes/teamMemberRoutes"); // Import team member routes
const ticketAssignmentRoutes = require("./routes/ticketAssignmentRoutes"); // Import ticket assignment routes

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/communications", communicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teammembers", teamMemberRoutes); // Use team member routes
app.use("/api/ticketassignments", ticketAssignmentRoutes); // Use ticket assignment routes

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });