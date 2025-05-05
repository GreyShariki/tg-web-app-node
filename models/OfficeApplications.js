module.exports = (sequelize, DataTypes) => {
  const office_applications = sequelize.define("office_applications", {
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return office_applications;
};
