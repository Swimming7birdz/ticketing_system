const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User"); // Import User model

const Ticket = sequelize.define(
  "Ticket",
  {
    ticket_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Ensure it references the correct table
        key: "user_id",
      },
    }, 
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issue_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sponsor_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    section: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    issue_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "ongoing", "resolved"),
      defaultValue: "new",
    },
    escalated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tickets",
    timestamps: false,
  }
);

// Define Association
Ticket.belongsTo(User, { foreignKey: "student_id", as: "student" });

module.exports = Ticket;

