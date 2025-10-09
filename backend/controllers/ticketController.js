const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Team = require("../models/Team");
const Communication = require("../models/Communication"); 
const sendEmail = require('../services/emailService');
const TicketAssignment = require("../models/TicketAssignment");

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
	
    res.json(tickets);
  } catch (error) {
    res.status(507).json({ error: error.message });
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
    res.status(509).json({ error: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.ticket_id;

    //Make sure ticketId includes associated student name as well. 
    const ticket = await Ticket.findByPk(ticketId, {
      include: [{
        model: User,
        as: 'student',
        attributes: ['name']
      }]
    });

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
  console.log(" Request from User:", req.user);
  console.log(" Requested Ticket ID:", req.params.ticket_id);

  if (req.user.role !== 'admin') {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    const ticketAssignments = await TicketAssignment.findAll({where: { ticket_id: req.params.ticket_id },});
    const firstAssignment = ticketAssignments[0]; // Get the first element
     if (
      !(!ticket || ticket.student_id !== req.user_id) &&
      (!firstAssignment || firstAssignment.user_id !== req.user_id)
      ) {
      console.log(" Access Denied - User is not allowed to view this ticket.");
      return res.status(403).json({ error: "Access denied: You can only view your own tickets." });
    }
  }

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
    res.status(511).json({ error: error.message });
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
    res.status(512).json({ error: error.message });
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
    res.status(513).json({ error: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      // Delete associated ticket assignments first
      await TicketAssignment.destroy({
        where: { ticket_id: req.params.ticket_id }
      });

      // Delete associated communications
      await Communication.destroy({
        where: { ticket_id: req.params.ticket_id }
      });

      // Now delete the ticket
      await ticket.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(514).json({ error: error.message });
  }
};

//Robert: need to have backend controller
exports.editTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    //Update ticket with request body data
    await ticket.update(req.body);

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket, //Return updated ticket data
    });
  } catch(error) {
    console.error("Error editing ticket:", error);
    res.status(500).json({ error: error.message});
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    await ticket.update({ status: req.body.status });
    const updatedTicket = await Ticket.findByPk(req.params.ticket_id);

    const student = await User.findByPk(ticket.student_id);

    if (!student || !student.email) {
      console.warn("Student not found or missing email.");
    } else if (!student.notifications_enabled) {
      console.log(`Email not sent — notifications disabled for ${student.email}`);
    } else {
      const isEscalated = req.body.status.toLowerCase() === 'escalated';

      const subject = isEscalated
        ? 'Your Ticket Has Been Escalated'
        : 'Ticket Status Updated';

      const body = isEscalated
        ? `Your ticket (ID: ${ticket.ticket_id}) has been escalated and is under review.`
        : `Your ticket (ID: ${ticket.ticket_id}) has been updated to "${req.body.status}".`;

      //await sendEmail(student.email, subject, body);

      if (isEscalated) {
        // const instructorEmails = ['instructor1@asu.edu', 'instructor2@asu.edu'];
        // for (const email of instructorEmails) {
        //   await sendEmail(
        //     email,
        //     `Ticket Escalated: ID ${ticket.ticket_id}`,
        //     `Ticket ID ${ticket.ticket_id} has been escalated.\n\nStudent: ${student.name} (${student.email})`
        //   );
        // }
      }
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket and sending email:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.escalateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      await ticket.update({ escalated: true });
      res.json(ticket);
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(516).json({ error: error.message });
  }
};

exports.deescalateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticket_id);
    if (ticket) {
      await ticket.update({ escalated: false });
      res.json(ticket);
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    res.status(516).json({ error: error.message });
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
    res.status(517).json({ error: error.message });
  }
};
