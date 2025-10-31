const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TicketAssignment = sequelize.define("TicketAssignment", {
  ticket_assignment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'ticketassignments', // Ensure the table name is lowercase
  timestamps: false,
  indexes: [
    {
      name: 'ticket_user_unique',
      unique: true,
      fields: ['ticket_id', 'user_id'],
    },
  ],

});

module.exports = TicketAssignment;