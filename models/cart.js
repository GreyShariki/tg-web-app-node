module.exports = (sequelize, DataTypes) => {
  const cart = sequelize.define(
    "cart",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "cart",
      timestamps: true,
      defaultScope: {
        include: [
          {
            association: "product",
            attributes: ["id", "name", "price", "photo"],
          },
        ],
      },
    }
  );
  return cart;
};
