module.exports = (sequelize, DataTypes) => {
  const catalog = sequelize.define(
    "catalog",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sizes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
          const rawValue = this.getDataValue("sizes");
          return rawValue ? rawValue : [];
        },
        set(value) {
          this.setDataValue("sizes", Array.isArray(value) ? value : [value]);
        },
      },
    },
    {
      getterMethods: {
        availableSizes() {
          return this.getDataValue("sizes") || [];
        },
      },
    }
  );

  return catalog;
};
