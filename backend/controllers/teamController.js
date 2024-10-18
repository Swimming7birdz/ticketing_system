const Team = require("../models/Team");

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.team_id);
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.team_id);
    if (team) {
      await team.update(req.body);
      res.json(team);
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.team_id);
    if (team) {
      await team.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};