const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Ticket = sequelize.define("Ticket", {
  ticket_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("open", "ongoing", "resolved"),
    defaultValue: "open",
  },
  category: {
    type: DataTypes.ENUM(
      "grade appeal",
      "sponsor issue",
      "team issue",
      "extension",
      "other"
    ),
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Ticket;
