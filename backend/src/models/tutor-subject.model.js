module.exports = (sequelize, DataTypes) => {
  const TutorSubject = sequelize.define(
    "TutorSubject",
    {
      tutor_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },

      subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "tutor_subjects",

      timestamps: false,

      underscored: true,
    }
  );

  TutorSubject.associate = (models) => {
    TutorSubject.belongsTo(models.TutorProfile, {
      foreignKey: "tutor_profile_id",
      as: "tutorProfile",
    });

    TutorSubject.belongsTo(models.Subject, {
      foreignKey: "subject_id",
      as: "subject",
    });
  };

  return TutorSubject;
};