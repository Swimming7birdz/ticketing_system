const express = require("express");
const ticketAssignmentController = require("../controllers/ticketAssignmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  ticketAssignmentController.getAllTicketAssignments
);
router.get(
  "/ticket/:ticket_id",
  authMiddleware.verifyToken,
  authMiddleware.isTAOrAdmin,
  ticketAssignmentController.getTicketAssignmentsByTicketId
);
router.post(
  "/ticket/:ticket_id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  ticketAssignmentController.assignTicket
);
router.delete(
  "/ticket/:ticket_id/assignment/:user_id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  ticketAssignmentController.removeTicketAssignment
);
// Added This
router.get(
  "/ticketCountsByTA",
  //authMiddleware.verifyToken,
  //authMiddleware.isAdmin,
  ticketAssignmentController.getTicketCountsByTA
);

module.exports = router;
