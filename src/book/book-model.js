const { TableEnum } = require("../config/constants");

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    TableEnum.BOOK,
    {
      title: DataTypes.STRING,
      isbn: DataTypes.STRING,
      revision_number: DataTypes.STRING,
    },
    { freezeTableName: true, timestamp: false }
  );
  return Book;
};
