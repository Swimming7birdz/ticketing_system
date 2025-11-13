const express = require("express");
const router = express.Router();

const bugReportController = require("../controllers/bugReportController"); // adjust path/name if needed

router.post("/", /* requireAuth, */ bugReportController.create);
router.get("/", /* requireAuth, */ bugReportController.list);
router.get("/:id", /* requireAuth, */ bugReportController.getOne);
router.patch("/:id", /* requireAuth, */ bugReportController.update);
router.delete("/:id", /* requireAuth, */ bugReportController.remove);

module.exports = router;
