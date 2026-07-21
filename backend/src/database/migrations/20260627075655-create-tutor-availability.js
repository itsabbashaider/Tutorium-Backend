'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tutor_availability', {
      availability_slot_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      tutor_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tutor_profiles',
          key: 'tutor_profile_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      day_of_week: {
        type: Sequelize.INTEGER, // Dialects differ, standard safe Integer used here for compatibility
        allowNull: false,
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Enforce business constraint check (start_time < end_time)
    await queryInterface.sequelize.query(
      'ALTER TABLE tutor_availability ADD CONSTRAINT check_start_time_before_end_time CHECK (start_time < end_time);'
    );

    await queryInterface.addIndex('tutor_availability', ['tutor_profile_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tutor_availability');
  },
};