const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
      allowNull: false,
      field: 'user_id'
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: 'google_id'
    },
    security_question_1: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'security_question_1'
    },
    security_answer_hash_1: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'security_answer_hash_1'
    },
    security_question_2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'security_question_2'
    },
    security_answer_hash_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'security_answer_hash_2'
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_password_expires'
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'phone_number'
    },
    role: {
      type: DataTypes.ENUM('STUDENT', 'TUTOR'),
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  User.associate = (models) => {
    User.hasOne(models.TutorProfile, { foreignKey: 'userId', as: 'tutorProfile' });
  };

  return User;
};