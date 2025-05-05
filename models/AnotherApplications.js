module.exports = (sequelize, DataTypes) => {
  const another_applications = sequelize.define("another_applications", {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    urgency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  return another_applications;
};
