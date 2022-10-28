const express = require("express");
const router = express.Router();
const bookService = require("./book-service");
const multer = require("multer");
const {
  InvalidPayloadError,
  InternalServerError,
} = require("../config/errors");
const { coverPageStorage } = require("../utility/utils");
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

router.get("/filter", async (req, res) => {
  try {
    const data = await bookService.filterBook(req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});
router.get("/get-all", async (req, res) => {
  try {
    const data = await bookService.getAllBooks(req.userId);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});

router.post("/add-book", (req, res) => {
  multerConfig.storage = coverPageStorage;
  multer(multerConfig).single("cover_page_image")(req, res, async (err) => {
    if (err) {
      const internalServerError = new InternalServerError(undefined, {
        cause: err,
      });
      res
        .status(internalServerError.status)
        .json(internalServerError.toObject());
    } else {
      try {
        const data = await bookService.addNewBook(req.userId, {
          ...req.body,
          cover_page_image: req.file || req.body.cover_page_image,
        });
        res.json(data);
      } catch (error) {
        res.status(error.status).json(error.toObject());
      }
    }
  });
});
router.put("/update-book", (req, res) => {
  multerConfig.storage = coverPageStorage;
  multer(multerConfig).single("cover_page_image")(req, res, async (err) => {
    if (err) {
      const internalServerError = new InternalServerError(undefined, {
        cause: err,
      });
      res
        .status(internalServerError.status)
        .json(internalServerError.toObject());
    } else {
      try {
        const data = await bookService.updateBook(req.userId, req.query, {
          ...req.body,
          cover_page_image: req.file || req.body.cover_page_image,
        });
        res.json(data);
      } catch (error) {
        res.status(error.status).json(error.toObject());
      }
    }
  });
});
module.exports = router;
