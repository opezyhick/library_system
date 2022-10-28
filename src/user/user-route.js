const express = require("express");
const router = express.Router();
const userService = require("./user-service");
const { passportStorage } = require("../utility/utils");
const { InternalServerError } = require("../config/errors");
const multer = require("multer");

const multerConfig = {
  limits: { fileSize: 1024 * 1024 * 10 },
  fileTypes: "png|jpeg",
  fileFilter(req, file, cb) {
    // if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    if (new RegExp(this.fileTypes, "g").test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new InvalidPayloadError(`Unsupported file format "${file.mimetype}"`),
        false
      );
    }
  },
};
const upload = multer(multerConfig);

router.post("/login", async (req, res) => {
  try {
    const data = await userService.login(req.body);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});

router.post("/register", async (req, res) => {
  try {
    const data = await userService.register(req.body);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});

router.get("/all-user", async (req, res) => {
  try {
    const data = await userService.getAllUser(req.userId);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});

router.put("/upload-photo", (req, res) => {
  multerConfig.storage = passportStorage;
  multer(multerConfig).single("profile_photo")(req, res, async (err) => {
    if (err) {
      const internalServerError = new InternalServerError(undefined, {
        cause: err,
      });
      res
        .status(internalServerError.status)
        .json(internalServerError.toObject());
    } else {
      try {
        const data = await userService.updateProfilePhoto(req.userId, {
          ...req.body,
          profile_photo: req.file || req.body.profile_photo,
        });
        res.json(data);
      } catch (error) {
        res.status(error.status).json(error.toObject());
      }
    }
  });
});

router.get("/get-all-user-log", async (req, res) => {
  try {
    const data = await userService.getAllUserCheckOut(req.userId, req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});
module.exports = router;
