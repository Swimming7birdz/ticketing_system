const express = require("express");
const tacommunicationController = require("../controllers/tacommunicationController");

const router = express.Router();

router.get("/:ticket_id/communications", tacommunicationController.getAllCommunicationsByTicketId);
router.post("/:ticket_id/communications", tacommunicationController.createCommunication);

module.exports = router;