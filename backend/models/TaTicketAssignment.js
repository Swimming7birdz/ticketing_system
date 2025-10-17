const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TaTicketAssignment = sequelize.define("TaTicketAssignment", {
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
    tableName: 'taticketassignments', // Ensure the table name is lowercase
    timestamps: false,
});

module.exports = TaTicketAssignment;