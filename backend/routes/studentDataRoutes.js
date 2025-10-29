const express = require("express");
const studentDataController = require("../controllers/studentDataController");

const router = express.Router();

router.get("/:user_id", studentDataController.getStudentDataByUserId);
router.post("/", studentDataController.createStudentData);
router.put("/:user_id", studentDataController.updateStudentData);

module.exports = router;