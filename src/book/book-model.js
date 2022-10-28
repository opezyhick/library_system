const { TableEnum } = require("../config/constants");
const { differenceInDays, isAfter, isBefore } = require("date-fns");

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    TableEnum.BOOK,
    {
      book_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING },
      cover_page_image: { type: DataTypes.STRING },
      isbn: { type: DataTypes.STRING },
      publisher: { type: DataTypes.STRING },
      authors: { type: DataTypes.STRING },
      genre: { type: DataTypes.STRING },
      description: { type: DataTypes.STRING },
      added_by: { type: DataTypes.STRING },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      //   status: {
      //     checked_out_date: { type: DataTypes.DATE },
      //     espected_check_in_date: { type: DataTypes.DATE },
      //     remaining_days: {
      //       type: DataTypes.VIRTUAL,
      //       get() {
      //         return isBefore(new Date(), new Date(this.checked_out_date))
      //           ? differenceInDays(
      //               new Date(this.espected_check_in_date),
      //               new Date(this.checked_out_date)
      //             )
      //           : 0;
      //       },
      //     },
      //   },
    },
    { freezeTableName: true, timestamps: false }
  );
  return Book;
};
