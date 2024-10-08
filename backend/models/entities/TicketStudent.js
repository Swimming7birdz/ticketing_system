const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const TicketStudent = sequelize.define("TicketStudent", {
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = TicketStudent;
