module.exports = (sequelize, DataTypes) => {
  const tech_applications = sequelize.define("tech_applications", {
    type_of_device: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chat_id: {
      type: DataTypes.INTEGER,
    },
    type_of_failure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return tech_applications;
};
