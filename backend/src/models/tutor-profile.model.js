const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const TutorProfile = sequelize.define(
    "TutorProfile",
    {
      tutor_profile_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },

      professional_bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },

      hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          isDecimal: true,
        },
      },

      teaching_mode: {
        type: DataTypes.ENUM("ONLINE", "IN_PERSON", "BOTH"),
        allowNull: false,
        defaultValue: "ONLINE",
      },

      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      avg_rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
      },

      total_completed_sessions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      total_earnings: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      tableName: "tutor_profiles",
      timestamps: true,
      underscored: true,
    }
  );

  TutorProfile.associate = (models) => {
    // One-to-One
    TutorProfile.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    // One-to-Many
    TutorProfile.hasMany(models.TutorAvailability, {
      foreignKey: "tutor_profile_id",
      as: "availabilitySlots",
    });

    TutorProfile.hasMany(models.Booking, {
      foreignKey: "tutor_profile_id",
      as: "bookings",
    });

    // Many-to-Many
    TutorProfile.belongsToMany(models.Subject, {
      through: models.TutorSubject,
      foreignKey: "tutor_profile_id",
      otherKey: "subject_id",
      as: "subjects",
    });
  };

  return TutorProfile;
};