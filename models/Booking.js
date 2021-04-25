module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      bookingTime: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["PENDING", "BOOKED", "COMPLETED", "CANCELED"],
        allowNull: false,
      },
      transactionId: DataTypes.STRING,
      game: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true }
  );
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Booking.belongsTo(models.Coach, {
      foreignKey: {
        name: "coachId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Booking;
};
