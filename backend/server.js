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

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/communications", communicationRoutes);
app.use("/api/auth", authRoutes);

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