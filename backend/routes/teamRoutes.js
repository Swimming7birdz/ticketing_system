const express = require("express");
const teamController = require("../controllers/teamController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", teamController.getAllTeams);
router.get("/:team_id", teamController.getTeamById);
router.get("/name/:team_name", teamController.getTeamByName);
router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, teamController.createTeam);
router.put("/:team_id", authMiddleware.verifyToken, authMiddleware.isAdmin, teamController.updateTeam);
router.delete("/:team_id", authMiddleware.verifyToken, authMiddleware.isAdmin, teamController.deleteTeam);

module.exports = router;