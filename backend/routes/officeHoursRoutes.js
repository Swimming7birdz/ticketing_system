const express = require("express");
const officeHoursController = require("../controllers/officeHoursController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/users/:user_id",
  authMiddleware.verifyToken,
  authMiddleware.isStudentOrTAOrAdmin,
  officeHoursController.getOfficeHoursByTAId
);

router.put(
  "/users/:user_id",
  authMiddleware.verifyToken,
  authMiddleware.isTAOrAdmin,
  officeHoursController.assignOfficeHours
);
module.exports = router;
