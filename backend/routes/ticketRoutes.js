const express = require("express");
const ticketController = require("../controllers/ticketController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  ticketController.getAllTickets
);
router.get(
  "/user/:user_id",
  authMiddleware.verifyToken,
  ticketController.getTicketsByUserId
);
router.get(
  "/ta/:ta_id",
  authMiddleware.verifyToken,
  authMiddleware.isTAOrAdmin,
  ticketController.getTicketsByTAId
);
router.get(
  "/:ticket_id",
  authMiddleware.verifyToken,
  ticketController.getTicketById
);
router.get(
  "/info/:ticket_id",
  authMiddleware.verifyToken,
  ticketController.getAllTicketDataById
);
router.post(
  "/",
  authMiddleware.verifyToken,
  /*authMiddleware.isStudent,*/ ticketController.createTicket
);
router.put(
  "/:ticket_id",
  authMiddleware.verifyToken,
  authMiddleware.isStudentOrTAOrAdmin,
  ticketController.updateTicket
);
router.delete(
  "/:ticket_id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  ticketController.deleteTicket
);
router.put(
  "/:ticket_id/status",
  authMiddleware.verifyToken,
  authMiddleware.isTAOrAdmin,
  ticketController.updateTicketStatus
);
router.put(
  "/:ticket_id/escalate",
  authMiddleware.verifyToken,
  authMiddleware.isTA,
  ticketController.escalateTicket
);
router.put(
  "/:ticket_id/reassign",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  ticketController.reassignTicket
);

module.exports = router;
