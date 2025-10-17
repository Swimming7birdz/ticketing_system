const express = require("express");
const ticketAssignmentController = require("../controllers/taticketAssignmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware.verifyToken,
    authMiddleware.isTAOrAdmin,
    ticketAssignmentController.getAllTicketAssignments
);
router.get(
    "/users/:user_id",
    authMiddleware.verifyToken,
    ticketAssignmentController.getTicketAssignmentsByUserId
);
router.get( //changed to allow students to see TA assignments
    "/ticket/:ticket_id",
    authMiddleware.verifyToken,
    authMiddleware.isStudentOrTAOrAdmin,
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
// Added This
router.put(
    "/ticket/:ticket_id/assignment/:user_id",
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    ticketAssignmentController.reassignTA
);

router.get(
    "/users/:user_id",
    authMiddleware.verifyToken,
    authMiddleware.isTAOrAdmin,
    ticketAssignmentController.getTicketAssignmentsById
);

module.exports = router;
