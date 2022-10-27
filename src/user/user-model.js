const { TableEnum } = require("../config/constants");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    TableEnum.USER,
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      profile_photo: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        // This way, the current date/time will be used to populate this column (at the moment of insertion)
      },
    },
    { freezeTableName: true, timestamp: false }
  );
  return User;
};
