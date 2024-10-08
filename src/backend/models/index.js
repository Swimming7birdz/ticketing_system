const sequelize = require("../config/db");

// Import models from entities subfolder
const Role = require("./entities/Role");
const Ticket = require("./entities/Ticket");
const Comment = require("./entities/Comment");
const TicketStudent = require("./entities/TicketStudent");
const TicketHistory = require("./entities/TicketHistory");
const Notification = require("./entities/Notification");

// Define associations
// Example: User has many Tickets
// Ticket.belongsTo(User, { foreignKey: 'created_by' });
// Comment.belongsTo(User, { foreignKey: 'user_id' });
// TicketHistory.belongsTo(User, { foreignKey: 'changed_by' });
// Notification.belongsTo(User, { foreignKey: 'user_id' });

// Ticket associations
// Ticket.hasMany(Comment, { foreignKey: 'ticket_id' });
// TicketHistory.belongsTo(Ticket, { foreignKey: 'ticket_id' });
// TicketStudent.belongsTo(Ticket, { foreignKey: 'ticket_id' });
// Notification.belongsTo(Ticket, { foreignKey: 'ticket_id' });

module.exports = {
  sequelize,
  Role,
  Ticket,
  Comment,
  TicketStudent,
  TicketHistory,
  Notification,
};
