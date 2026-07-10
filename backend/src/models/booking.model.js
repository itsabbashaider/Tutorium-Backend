module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      booking_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      availability_slot_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      student_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      tutor_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      booking_start: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      booking_end: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      booked_hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
          isDecimal: true,
        },
      },

      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "ACCEPTED",
          "REJECTED",
          "CANCELLED",
          "COMPLETED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      meeting_link: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },

      intro_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      cancelled_by: {
        type: DataTypes.ENUM("STUDENT", "TUTOR"),
        allowNull: true,
      },

      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "bookings",
      timestamps: true,
      underscored: true,
    }
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.StudentProfile, {
      foreignKey: "student_profile_id",
      as: "student",
    });

    Booking.belongsTo(models.TutorProfile, {
      foreignKey: "tutor_profile_id",
      as: "tutor",
    });

    Booking.belongsTo(models.Subject, {
      foreignKey: "subject_id",
      as: "subject",
    });

    Booking.belongsTo(models.TutorAvailability, {
      foreignKey: "availability_slot_id",
      as: "availabilitySlot",
    });

    Booking.hasOne(models.Review, {
      foreignKey: "booking_id",
      as: "review",
    });
  };

  return Booking;
};