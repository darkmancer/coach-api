module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      reviewScore: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["SHOWING", "HIDING"],
        allowNull: false,
      },
    },
    { underscored: true }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Review.belongsTo(models.Coach, {
      foreignKey: {
        name: "coachId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Review;
};
