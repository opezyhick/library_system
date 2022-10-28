const express = require("express");
const router = express.Router();
const checkService = require("./check-service");

const {
  InvalidPayloadError,
  InternalServerError,
} = require("../config/errors");

router.get("/get-all", async (req, res) => {
  try {
    const data = await checkService.getAllCheckouts(req.userId);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});
router.post("/check-out", async (req, res) => {
  try {
    const data = await checkService.checkOutBook(req.userId, req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});
router.put("/check-in", async (req, res) => {
  try {
    const data = await checkService.checkInBook(req.userId, req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});

module.exports = router;
