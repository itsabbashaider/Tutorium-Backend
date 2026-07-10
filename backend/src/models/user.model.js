module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
      allowNull: false
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
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Enables soft deletes because you have a deleted_at column
    underscored: true
  });

  User.associate = (models) => {
    User.hasOne(models.TutorProfile, { foreignKey: 'userId', as: 'tutorProfile' });
    // Your StudentProfile association will tie in here once that file is generated
  };

  return User;
};