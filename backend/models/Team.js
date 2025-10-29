const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Team = sequelize.define("Team", {
  team_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  team_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sponsor_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sponsor_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instructor_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instructor_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
  tableName: 'teams', // Ensure the table name is lowercase
  timestamps: false,
});

module.exports = Team;