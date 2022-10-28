const mime = require("mime-types");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const { nanoid } = require("nanoid");

exports.PROJECT_ROOT_DIR = path.normalize(path.join(__dirname, ".."));

exports.ASSETS_ROOT_DIR = path.normalize(
  path.join(exports.PROJECT_ROOT_DIR, process.env.ASSET_DIRECTORY)
);
exports.IMAGE_ROOT_DIR = path.normalize(
  path.join(exports.ASSETS_ROOT_DIR, process.env.IMAGE_DIRECTORY)
);

exports.coverPageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `${exports.IMAGE_ROOT_DIR}/coverpageimages`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (req, file, cb) {
    const ext = mime.extension(file.mimetype);
    cb(null, `${req.userId}-coverpage.${ext}`);
  },
});

exports.passportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `${exports.IMAGE_ROOT_DIR}/passports`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (req, file, cb) {
    const ext = mime.extension(file.mimetype);
    cb(null, `${req.userId}-passport.${ext}`);
  },
});
