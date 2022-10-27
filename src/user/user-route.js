const express = require("express");
const router = express.Router();
const userService = require("./user-service");

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
    const data = await userService.getFeedbacks(req.userId, req.query);
    res.json(data);
  } catch (error) {
    res.status(error.status).json(error.toObject());
  }
});

module.exports = router;
