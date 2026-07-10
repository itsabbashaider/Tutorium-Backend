module.exports = (sequelize, DataTypes) => {
  const StudentProfile = sequelize.define(
    "StudentProfile",
    {
      student_profile_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },

      academic_level: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      learning_goals: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "student_profiles",
      timestamps: true,
      underscored: true,
    }
  );

  StudentProfile.associate = (models) => {
    StudentProfile.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return StudentProfile;
};