'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      // add columns as nullable
      await queryInterface.addColumn('teams', 'instructor_user_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }, { transaction: t });

      await queryInterface.addColumn('teams', 'sponsor_name', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction: t });

      await queryInterface.addColumn('teams', 'sponsor_email', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction: t });


      // backfill existing rows with default values    
      const [rows] = await queryInterface.sequelize.query(
        "SELECT user_id FROM users WHERE role = 'TA' ORDER BY user_id LIMIT 1",
        { transaction: t }
      );
      const taId = rows[0]?.user_id;
      if (taId) {
        await queryInterface.sequelize.query(
         'UPDATE teams SET instructor_user_id = :taId WHERE instructor_user_id IS NULL',
          { replacements: { taId }, transaction: t }
        );
      } else {
        // no TA found, must have at least one TA in users table
        throw new Error('No TA user found to backfill instructor_user_id');
      }

      await queryInterface.sequelize.query(
        `UPDATE teams
          SET sponsor_name = 'DefaultSponsor', 
          sponsor_email = 'DefaultSponsor@gmail.com'
        WHERE sponsor_name IS NULL`,
        { transaction: t }
      );


      //Keep the team if the instructor user is removed
      await queryInterface.addConstraint('teams', {
        fields: ['instructor_user_id'],
        type: 'foreign key',
        name: 'teams_instructor_user_id_fkey',
        references: {
          table: 'users',
          field: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t,
      });
   
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.sequelize.transaction(async (t) => {
     await queryInterface.removeColumn('teams', 'instructor_user_id', { transaction: t });
     await queryInterface.removeColumn('teams', 'sponsor_name', { transaction: t });
     await queryInterface.removeColumn('teams', 'sponsor_email', { transaction: t });
    });
  }
};
