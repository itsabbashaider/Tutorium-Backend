'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      booking_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      availability_slot_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'tutor_availability',
          key: 'availability_slot_id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      student_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'student_profiles',
          key: 'student_profile_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      subject_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'subject_id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      booking_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      booking_start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      booking_end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      booked_hourly_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      meeting_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      intro_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cancelled_by: {
        type: Sequelize.ENUM('STUDENT', 'TUTOR'),
        allowNull: true,
      },
      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    // 1. Enforce booking_start < booking_end
    await queryInterface.sequelize.query(
      'ALTER TABLE bookings ADD CONSTRAINT check_booking_start_before_booking_end CHECK (booking_start < booking_end);'
    );

    // 2. Enforce booking_date cannot be in the past (Allows Today and Future Dates)
    await queryInterface.sequelize.query(
      'ALTER TABLE bookings ADD CONSTRAINT check_booking_date_not_past CHECK (booking_date >= CURRENT_DATE);'
    );

    await queryInterface.addIndex('bookings', ['student_profile_id']);
    await queryInterface.addIndex('bookings', ['tutor_profile_id']);
    await queryInterface.addIndex('bookings', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('bookings');
  },
};