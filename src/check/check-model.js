const { TableEnum, CheckTypeEnum } = require("../config/constants");

module.exports = (sequelize, DataTypes) => {
  const Check = sequelize.define(
    TableEnum.CHECK,
    {
      check_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      book_id: { type: DataTypes.STRING },
      type: {
        type: DataTypes.ENUM(...Object.values(CheckTypeEnum)),
      },
      check_in_by: { type: DataTypes.STRING },
      check_in_at: { type: DataTypes.DATE },

      check_out_by: { type: DataTypes.STRING },
      check_out_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      espected_return_date: { type: DataTypes.DATE },
    },
    { freezeTableName: true, timestamps: false }
  );
  return Check;
};
