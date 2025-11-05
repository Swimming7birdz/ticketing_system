'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      /**
       * Add altering commands here.
       *
       * Example:
       * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
       */

      await queryInterface.createTable("tatickets", {
              ticket_id: {
                  type: DataTypes.INTEGER,
                  autoIncrement: true,
                  primaryKey: true,
              },
              ta_id: {
                  type: DataTypes.INTEGER,
                  allowNull: false,
                  references: {
                      model: "users",
                      key: "user_id"
                  }
              },
              issue_description: {
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
              tableName: "tatickets",
              timestamps: true,
              createdAt: 'created_at',
              updatedAt: 'updated_at',
          })
      await queryInterface.createTable("taticketassignments",
          {
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
          },
          {
              tableName: "taticketassignments",
              timestamps: false,
          })


      await queryInterface.createTable("taticketcommunications",
          {
              communication_id: {
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
              message: {
                  type: DataTypes.TEXT,
                  allowNull: false,
              },
              created_at: {
                  type: DataTypes.DATE,
                  defaultValue: DataTypes.NOW,
              },
          },
          {
              tableName: "taticketcommunications",
              timestamps: false,
          })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('tatickets');
    await queryInterface.dropTable("taticketassignments");
    await queryInterface.dropTable("taticketcommunications");
  }
};
