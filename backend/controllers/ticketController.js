const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Team = require("../models/Team");
const Communication = require("../models/Communication");

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      attributes: ["ticket_id", "issue_description", "status", "student_id"], //  Make sure "status" is included
      include: [{ model: User, as: "student", attributes: ["name"] }],
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTicketsByUserId = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { student_id: req.params.user_id },
      include: [{ model: User, as: "student", attributes: ["name"] }], //  Fetch student name
    });

    // Add student_name manually if needed
    const ticketsWithNames = tickets.map(ticket => ({
      ...ticket.dataValues,
      student_name: ticket.student ? ticket.student.name : "Unknown Student",
    }));

    res.json(ticketsWithNames);
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

//<<<<<<< HEAD
exports.getAllTicketDataById = async (req, res) => {
  console.log(" Request from User:", req.user);
  console.log(" Requested Ticket ID:", req.params.ticket_id);
/*=======
exports.getAllTicketDataById = async (req, res) => { //temporary fix in order to let TA view ticket page 2/24/25
    if (req.user.role != 'admin' && req.user.id != req.params.ticket_id ) {
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
>>>>>>> instructor_view

  if (req.user.role !== 'admin') {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (!ticket || ticket.student_id !== req.user.id) {
      console.log(" Access Denied - User is not allowed to view this ticket.");
      return res.status(403).json({ error: "Access denied: You can only view your own tickets." });
    }
<<<<<<< HEAD
  }
=======
  //}
};
>>>>>>> instructor_view
*/
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      const student = await User.findByPk(ticket.dataValues.student_id);
      const team = await Team.findByPk(ticket.dataValues.team_id);
      ticket.dataValues.student_name = student.dataValues.name;
      ticket.dataValues.team_name = team.team_name;

      res.json(ticket);
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    console.log(" Request Body:", req.body); //  Debugging input data


    const { student_id } = req.body;

    // Check if student exists
    const student = await User.findByPk(student_id);
    if (!student) {
      console.error(" Student not found in database:", student_id);
      return res.status(404).json({ error: "Student not found" });
    }

    console.log(" Student found:", student.name); //  Log correct name

    // Create ticket
    const ticket = await Ticket.create(req.body);

    res.status(201).json({
      ...ticket.dataValues,
      student_name: student.name, // Ensure correct name is returned
    });

  } catch (error) {
    console.error(" Error creating ticket:", error);
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
    console.log("🔹 Attempting to delete ticket:", req.params.ticket_id);
    console.log("🔹 Requesting User:", req.user); // Log user info

    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (!ticket) {
      console.log("Ticket not found.");
      return res.status(404).json({ error: "Ticket not found" });
    }

    console.log("Ticket found:", ticket.dataValues);

    await ticket.destroy();
    console.log("Ticket deleted successfully.");

    res.status(204).json();
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    await ticket.update({ status: req.body.status });
    const updatedTicket = await Ticket.findByPk(req.params.ticket_id); //  Fetch updated ticket

    res.json(updatedTicket);
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
