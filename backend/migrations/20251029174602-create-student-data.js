'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("studentdata", {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'user_id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        team_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'teams', key: 'team_id' },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
        section: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        acct_creation: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()'),
        },
      }, { transaction: t });

      // ensure one studentdata row per user (prevents duplicates)
      await queryInterface.addConstraint('studentdata', {
        fields: ['user_id'],
        type: 'unique',
        name: 'studentdata_user_id_unique',
        transaction: t,
      });

      // backfill: insert a row for every existing user with role = 'Student' (no duplicate due to NOT EXISTS)
      await queryInterface.sequelize.query(
        `
        INSERT INTO studentdata (user_id)
        SELECT u.user_id
        FROM users u
        WHERE u.role = 'student'
          AND NOT EXISTS (SELECT 1 FROM studentdata s WHERE s.user_id = u.user_id)
        `,
        { transaction: t }
      );
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('studentdata', { transaction: t });
    });
  }
};
