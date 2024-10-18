const User = require("./User");
const Team = require("./Team");
const Ticket = require("./Ticket");
const TeamMember = require("./TeamMember");
const TicketAssignment = require("./TicketAssignment");

// Define associations
User.hasMany(TeamMember, { foreignKey: 'user_id' });
TeamMember.belongsTo(User, { foreignKey: 'user_id' });

Team.hasMany(TeamMember, { foreignKey: 'team_id' });
TeamMember.belongsTo(Team, { foreignKey: 'team_id' });

User.hasMany(TicketAssignment, { foreignKey: 'user_id' });
TicketAssignment.belongsTo(User, { foreignKey: 'user_id' });

Ticket.hasMany(TicketAssignment, { foreignKey: 'ticket_id' });
TicketAssignment.belongsTo(Ticket, { foreignKey: 'ticket_id' });

module.exports = {
  User,
  Team,
  Ticket,
  TeamMember,
  TicketAssignment,
};