const express = require("express");
const teamController = require("../controllers/teamController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("pong");
});

module.exports = router;
