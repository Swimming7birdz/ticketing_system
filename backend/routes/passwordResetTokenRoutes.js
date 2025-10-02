const express = require("express");
const passwordResetTokenController = require("../controllers/passwordResetTokenController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/password-reset-tokens/reset/:email",
  authMiddleware.verifyToken,
  passwordResetTokenController.requestPasswordReset
);


module.exports = router;