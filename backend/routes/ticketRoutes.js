const express = require("express");
const ticketController = require("../controllers/ticketController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware.isAdmin, ticketController.getAllTickets);
router.get("/users/:user_id/tickets", ticketController.getTicketsByUserId);
router.get("/users/:ta_id/assigned-tickets", ticketController.getTicketsByTAId);
router.get("/:ticket_id", ticketController.getTicketById);
router.post("/", authMiddleware.isStudent, ticketController.createTicket);
router.put("/:ticket_id", authMiddleware.isStudentOrTAOrAdmin, ticketController.updateTicket);
router.delete("/:ticket_id", authMiddleware.isAdmin, ticketController.deleteTicket);
router.put("/:ticket_id/status", authMiddleware.isTAOrAdmin, ticketController.updateTicketStatus);
router.put("/:ticket_id/escalate", authMiddleware.isTA, ticketController.escalateTicket);
router.put("/:ticket_id/reassign", authMiddleware.isAdmin, ticketController.reassignTicket);

module.exports = router;