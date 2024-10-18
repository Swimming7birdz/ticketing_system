const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TeamMember = sequelize.define("TeamMember", {
  team_member_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'teammembers', // Ensure the table name is lowercase
  timestamps: false,
});

module.exports = TeamMember;