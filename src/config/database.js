const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
  }
);

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.User = require("../user/user-model")(sequelize, Sequelize.DataTypes);
db.models.Book = require("../book/book-model")(sequelize, Sequelize.DataTypes);
db.models.Check = require("../check/check-model")(
  sequelize,
  Sequelize.DataTypes
);

module.exports = db;
