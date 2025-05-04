module.exports = (sequelize, DataTypes) => {
  const network_applications = sequelize.define("network_applications", {
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    connectionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    signsStr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return network_applications;
};
