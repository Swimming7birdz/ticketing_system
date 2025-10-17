const TaTicketAssignment = require("../models/TaTicketAssignment");
const User = require("../models/User");
const TaTicket = require("../models/TaTicket");

exports.getAllTicketAssignments = async (req, res) => {
    try {
        const ticketAssignments = await TaTicketAssignment.findAll();
        res.json(ticketAssignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTicketAssignmentsByTicketId = async (req, res) => {
    try {
        const ticketAssignments = await TaTicketAssignment.findAll({
            where: { ticket_id: req.params.ticket_id },
        });
        res.json(ticketAssignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTicketAssignmentsByUserId = async (req, res) => {
    try {
        const ticketAssignments = await TaTicketAssignment.findAll({
            where: { user_id: req.params.user_id },
        });
        res.json(ticketAssignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.assignTicket = async (req, res) => {
    try {

        const { ticket_id } = req.params;
        const { user_id } = req.body;

        const ticket = await TaTicket.findByPk(ticket_id);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found." });
        }

        if (ticket.ta_id === parseInt(user_id, 10)) {
            return res.status(400).json({ error: "A user cannot be assigned a ticket they created." });
        }

        const ticketAssignment = await TaTicketAssignment.create({
            ticket_id: req.params.ticket_id,
            user_id: req.body.user_id,
        });
        res.status(201).json(ticketAssignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeTicketAssignment = async (req, res) => {
    try {
        const ticketAssignment = await TaTicketAssignment.findOne({
            where: { ticket_id: req.params.ticket_id, user_id: req.params.user_id },
        });
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

// Added this

exports.getTicketCountsByTA = async (req, res) => {
    try {
        // Fetch all users with the role "TA"
        const TAs = await User.findAll({
            where: { role: "TA" },
            attributes: ["user_id", "name", "role"],
            // include: [
            //   {
            //     model: TicketAssignment,
            //   },
            // ],
        });

        // Log the fetched TAs for debugging
        console.log("Fetched TAs:", TAs);

        // Return the TAs as a JSON response
        res.json(TAs);
    } catch (error) {
        console.error("Detailed error message:", error.message);
        console.error("Error stack trace:", error.stack);
        res.status(500).json({ error: "An error occurred while fetching TAs." });
    }
};

exports.reassignTA = async (req, res) => {
    try {
        const ticketAssignment = await TaTicketAssignment.findOne({
            where: { ticket_id: req.params.ticket_id, user_id: req.params.user_id },
        });
        if (ticketAssignment) {
            const updatedTicketAssignment = await ticketAssignment.update({ user_id: req.body.new_user_id });
            res.json(updatedTicketAssignment);
        } else {
            res.status(404).json({ error: "Ticket Assignment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTicketAssignmentsById = async (req, res) => {
    try {
        const ticketAssignments = await TaTicketAssignment.findAll({
            where: { user_id: req.params.user_id },
        });
        res.json(ticketAssignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.getTicketCountsByTA = async (req, res) => {
//   try {
//     // Fetch all users with the role "TA"
//     console.log(User.associations);
//     const TAs = await User.findAll({
//       where: { role: "TA" },
//       attributes: ["user_id", "name", "role"],
//       include: [
//         {
//           model: TicketAssignment,
//           include: [
//             {
//               model: Ticket,
//               attributes: ["status"], // Only include the status field
//             },
//           ],
//         },
//       ],
//     });

//     // Process the data to get ticket counts by status for each TA
//     const result = TAs.map((TA) => {
//       // Initialize ticket counts for each status
//       const ticketCounts = { new: 0, ongoing: 0, resolved: 0, escalated: 0 };

//       // Loop through each ticket assignment for this TA
//       TA.TicketAssignments.forEach((assignment) => {
//         const ticketStatus = assignment.Ticket?.status; // Check if ticket exists and get its status
//         if (ticketStatus) {
//           // Increment the count for the appropriate status
//           if (ticketCounts.hasOwnProperty(ticketStatus)) {
//             ticketCounts[ticketStatus] += 1;
//           }
//         }
//       });

//       // Return a simplified object with TA information and ticket counts
//       return {
//         TA_name: TA.name,
//         TA_id: TA.user_id,
//         ticketCounts,
//       };
//     });

//     console.log("Processed TA ticket counts:", result); // Log processed result
//     res.json(result); // Send the processed result as response
//   } catch (error) {
//     console.error("Detailed error message:", error.message);
//     console.error("Error stack trace:", error.stack);
//     res.status(500).json({ error: "An error occurred while fetching TAs." });
//   }
// };
