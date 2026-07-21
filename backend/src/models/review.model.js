const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      review_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false,
      },

      booking_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },

      rating: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
          isInt: true,
        },
      },

      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "reviews",
      timestamps: true,
      underscored: true,
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.Booking, {
      foreignKey: "booking_id",
      as: "booking",
    });
  };

  return Review;
};