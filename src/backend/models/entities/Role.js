const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

module.exports = Role;
