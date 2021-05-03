module.exports = (sequelize, DataTypes) => {
  const Coach = sequelize.define(
    "Coach",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      discord: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rank: DataTypes.STRING,
      achievement: DataTypes.STRING,
      about: DataTypes.STRING,
      game: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar:DataTypes.STRING,
      price: DataTypes.STRING
    },
    { underscored: true }
  );
  Coach.associate = (models) => {
    Coach.hasMany(models.Booking, {
      foreignKey: {
        name: "coachId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Coach.hasMany(models.Review, {
      foreignKey: {
        name: "coachId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Coach;
};
