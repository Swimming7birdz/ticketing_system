const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Team = require("../models/Team");
const Communication = require("../models/Communication");

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTicketsByUserId = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ where: { student_id: req.params.user_id } });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTicketsByTAId = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ where: { assigned_to: req.params.ta_id } });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTicketDataById = async (req, res) => {
  if ( req.user.role != 'admin' && req.user.id != req.params.ticket_id ) {
    res.status(404).json({error: "user does not have access to this ticket"})
  }
  else {
    try {
      const ticket = await Ticket.findByPk(req.params.ticket_id);
      if (ticket) {
        const student = await User.findByPk(ticket.dataValues.student_id); // Grab student and team names before returning
        const team = await Team.findByPk(ticket.dataValues.team_id);
        ticket.dataValues.student_name = student.dataValues.name
        ticket.dataValues.team_name = team.team_name

        res.json(ticket);
      } else {
        res.status(404).json({ error: "Ticket not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      await ticket.update(req.body);
      res.json(ticket);
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      await ticket.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      await ticket.update({ status: req.body.status });
      res.json(ticket);
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.escalateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      await ticket.update({ status: "escalated" });
      res.json(ticket);
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reassignTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      await ticket.update({ assigned_to: req.body.assigned_to });
      res.json(ticket);
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};