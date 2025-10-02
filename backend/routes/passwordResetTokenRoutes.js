const express = require("express");
const passwordResetTokenController = require("../controllers/passwordResetTokenController");

const router = express.Router();

router.post(
  "/reset/:email",
  passwordResetTokenController.requestPasswordReset
);


module.exports = router;