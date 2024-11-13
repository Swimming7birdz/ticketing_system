const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const submitTicket = sequelize.define("submitTicket", {
    studentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    teamName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    classSection: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sponsorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    instructorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issueType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    teamMembers: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    newMembers: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    tableName: 'submitticket',
    timestamps: false,
});

module.exports = submitTicket;