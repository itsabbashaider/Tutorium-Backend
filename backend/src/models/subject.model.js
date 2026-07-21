const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define(
    "Subject",
    {
      subject_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false,
      },

      subject_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "subjects",
      timestamps: true,
      underscored: true,
    }
  );

  Subject.associate = (models) => {
    Subject.belongsToMany(models.TutorProfile, {
      through: models.TutorSubject,
      foreignKey: "subject_id",
      otherKey: "tutor_profile_id",
      as: "tutors",
    });

    
    Subject.hasMany(models.Booking, {
      foreignKey: "subject_id",
      as: "bookings",
    });
  };

  return Subject;
};