const express = require("express");
const passwordResetTokenController = require("../controllers/passwordResetTokenController");

const router = express.Router();

router.post(
  "/reset",
  passwordResetTokenController.requestPasswordReset
);

router.post(
  "/validate",
  passwordResetTokenController.validatePasswordResetToken
)

module.exports = router;