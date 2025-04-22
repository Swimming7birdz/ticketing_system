const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OfficeHours = sequelize.define("OfficeHours", {
  office_hours_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  office_hours: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'officehours', // Ensure the table name is lowercase
  timestamps: false,
});

module.exports = OfficeHours;
