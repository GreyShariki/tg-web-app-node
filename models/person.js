module.exports = (sequelize, DataTypes) => {
  const person = sequelize.define("person", {
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
    chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  return person;
};
