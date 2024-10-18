const TicketAssignment = require("../models/TicketAssignment");

exports.getAllTicketAssignments = async (req, res) => {
  try {
    const ticketAssignments = await TicketAssignment.findAll();
    res.json(ticketAssignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTicketAssignmentsByTicketId = async (req, res) => {
  try {
    const ticketAssignments = await TicketAssignment.findAll({ where: { ticket_id: req.params.ticket_id } });
    res.json(ticketAssignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const ticketAssignment = await TicketAssignment.create({ ticket_id: req.params.ticket_id, user_id: req.body.user_id });
    res.status(201).json(ticketAssignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeTicketAssignment = async (req, res) => {
  try {
    const ticketAssignment = await TicketAssignment.findOne({ where: { ticket_id: req.params.ticket_id, user_id: req.params.user_id } });
    if (ticketAssignment) {
      await ticketAssignment.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Ticket assignment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};