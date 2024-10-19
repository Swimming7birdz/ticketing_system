const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const TicketHistory = sequelize.define("TicketHistory", {
  history_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  changed_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  old_status: {
    type: DataTypes.ENUM("open", "ongoing", "resolved"),
    allowNull: true,
  },
  new_status: {
    type: DataTypes.ENUM("open", "ongoing", "resolved"),
    allowNull: true,
  },
  changed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = TicketHistory;
