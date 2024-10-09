const Communication = require("../models/Communication");

exports.getAllCommunicationsByTicketId = async (req, res) => {
  try {
    const communications = await Communication.findAll({ where: { ticket_id: req.params.ticket_id } });
    res.json(communications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCommunication = async (req, res) => {
  try {
    const communication = await Communication.create({
      ticket_id: req.params.ticket_id,
      user_id: req.body.user_id,
      message: req.body.message,
    });
    res.status(201).json(communication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};