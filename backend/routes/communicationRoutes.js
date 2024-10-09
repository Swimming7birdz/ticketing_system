const express = require("express");
const communicationController = require("../controllers/communicationController");

const router = express.Router();

router.get("/:ticket_id/communications", communicationController.getAllCommunicationsByTicketId);
router.post("/:ticket_id/communications", communicationController.createCommunication);

module.exports = router;