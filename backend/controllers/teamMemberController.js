const TeamMember = require("../models/TeamMember");

exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll();
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeamMembersByTeamId = async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll({ where: { team_id: req.params.team_id } });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addTeamMember = async (req, res) => {
  try {
    const { team_id, user_id } = req.body;
    const [member, created] = await TeamMember.findOrCreate({
       where: { team_id, user_id },
       defaults: { team_id, user_id }
    });
    if (created) return res.status(201).json({ created: true, member });
    return res.status(200).json({ created: false, member });

    // const teamMember = await TeamMember.create({ team_id: req.params.team_id, user_id: req.body.user_id });
    // res.status(201).json(teamMember);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const details = (error.errors || []).map(e => ({ path: e.path, message: e.message }));
      return res.status(409).json({ error: 'Unique constraint', details });
    }
    if (error.name === 'SequelizeValidationError') {
      const details = (error.errors || []).map(e => ({ path: e.path, message: e.message }));
      return res.status(400).json({ error: 'Validation error', details });
    }

    res.status(500).json({ error: error.message });
  }
};

exports.removeTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findOne({ where: { team_id: req.params.team_id, user_id: req.params.user_id } });
    if (teamMember) {
      await teamMember.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Team member not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};