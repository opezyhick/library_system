require("dotenv").config();
const logger = require("./config/logging").getLogger("APP");

const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const { auth } = require("./config/middlewares");
const userRoutes = require("./user/user-route");
const bookRoutes = require("./book/book-route");
const { IMAGE_ROOT_DIR } = require("./utility/utils");

const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(`/${process.env.IMAGE_DIRECTORY}`, express.static(IMAGE_ROOT_DIR));

app.use(
  auth({
    allowRoutes: ["/user/login", "/user/register"],
  })
);
app.use("/user", userRoutes);
app.use("/book", bookRoutes);

startApp();

async function startApp() {
  try {
    await database.sequelize.sync();
    app.listen(PORT, () => {
      logger.info(`🚀 APP: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
