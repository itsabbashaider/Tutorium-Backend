module.exports = (sequelize, DataTypes) => {
  const TutorAvailability = sequelize.define(
    "TutorAvailability",
    {
      availability_slot_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      tutor_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 6,
        },
      },

      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "tutor_availability",
      timestamps: true,
      underscored: true,
    }
  );

  TutorAvailability.associate = (models) => {
    TutorAvailability.belongsTo(models.TutorProfile, {
      foreignKey: "tutor_profile_id",
      as: "tutorProfile",
    });

    TutorAvailability.hasMany(models.Booking, {
      foreignKey: "availability_slot_id",
      as: "bookings",
    });
  };

  return TutorAvailability;
};