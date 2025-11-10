const express = require("express");
const teamMemberController = require("../controllers/teamMemberController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware.verifyToken, authMiddleware.isAdmin, teamMemberController.getAllTeamMembers);
router.get("/team/:team_id", authMiddleware.verifyToken, authMiddleware.isTAOrAdmin, teamMemberController.getTeamMembersByTeamId);
router.post("/team/", authMiddleware.verifyToken, authMiddleware.isAdmin, teamMemberController.addTeamMember);
router.delete("/team/:team_id/member/:user_id", authMiddleware.verifyToken, authMiddleware.isAdmin, teamMemberController.removeTeamMember);

module.exports = router;