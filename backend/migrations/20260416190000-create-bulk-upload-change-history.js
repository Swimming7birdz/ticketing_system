'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('bulk_upload_change_history', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        upload_batch_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        entity_type: {
          type: Sequelize.ENUM('student', 'team', 'team_member'),
          allowNull: false,
        },
        entity_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        entity_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        change_type: {
          type: Sequelize.ENUM('created', 'updated', 'added', 'removed', 'moved'),
          allowNull: false,
        },
        field_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        old_value: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        new_value: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        changed_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'user_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        changed_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        source: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'bulk_upload',
        },
      }, { transaction: t });

      await queryInterface.addIndex('bulk_upload_change_history', ['upload_batch_id'], {
        name: 'bulk_upload_change_history_batch_idx',
        transaction: t,
      });
      await queryInterface.addIndex('bulk_upload_change_history', ['entity_type', 'entity_id'], {
        name: 'bulk_upload_change_history_entity_idx',
        transaction: t,
      });
      await queryInterface.addIndex('bulk_upload_change_history', ['changed_at'], {
        name: 'bulk_upload_change_history_changed_at_idx',
        transaction: t,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bulk_upload_change_history');
  },
};
