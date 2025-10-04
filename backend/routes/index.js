const userRoutes = require("./userRoutes");
const teamRoutes = require("./teamRoutes");
const ticketRoutes = require("./ticketRoutes");
const communicationRoutes = require("./communicationRoutes");
const authRoutes = require("./authRoutes");
const teamMemberRoutes = require("./teamMemberRoutes");
const ticketAssignmentRoutes = require("./ticketAssignmentRoutes");
const officeHoursRoutes = require("./officeHoursRoutes");
const encryptionRoutes = require("./encryptionRoutes");
const pingRoutes = require("./pingRoutes");
const emailRoutes = require('./emailRoutes');
const passwordResetTokenRoutes = require('./passwordResetTokenRoutes');

// Array to simplify route setup
const routes = [
  { path: "/api/users", route: userRoutes },
  { path: "/api/teams", route: teamRoutes },
  { path: "/api/tickets", route: ticketRoutes },
  { path: "/api/communications", route: communicationRoutes },
  { path: "/api/auth", route: authRoutes },
  { path: "/api/teammembers", route: teamMemberRoutes },
  { path: "/api/ticketassignments", route: ticketAssignmentRoutes },
  { path: "/api/ping", route: pingRoutes },
  { path: "/api/officehours", route: officeHoursRoutes},
  { path: "/api/encrypt", route: encryptionRoutes },
  { path: "/api/email", route: emailRoutes },
  { path: "/api/password-reset-tokens", route: passwordResetTokenRoutes } 
];

module.exports = (app) => {
  routes.forEach((route) => {
    app.use(route.path, route.route);
  });
};
