const express = require("express");
const ticketAssignmentController = require("../controllers/ticketAssignmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isTAOrAdmin,
  ticketAssignmentController.getAllTicketAssignments
);
router.get(
  "/ticket/:ticket_id",
  authMiddleware.verifyToken,
  authMiddleware.isTAOrAdmin,
  ticketAssignmentController.getTicketAssignmentsByTicketId
);
router.post( // 2/21/25 changed to allow everyone to post in order to stop getting ticket assignment error
  "/ticket/:ticket_id",
  authMiddleware.verifyToken,
  authMiddleware.isStudentOrTAOrAdmin,
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
