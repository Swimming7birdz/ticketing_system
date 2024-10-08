const express = require("express");
const cors = require("cors");
require("dotenv").config();
//const userRoutes = require("./routes/userRoutes");

// DB Schemas
const {
  sequelize,
  Role,
  Ticket,
  Comment,
  TicketStudent,
  TicketHistory,
  Notification,
} = require("./models");

const app = express();

// Just Testing Some stuff
(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync all models
    await sequelize.sync({ force: true });
    console.log("Database & tables created!");

    // Function to create multiple records and log them
    const createMultiple = async (Model, count, dataFn) => {
      let records = [];
      for (let i = 0; i < count; i++) {
        const record = await Model.create(dataFn(i));
        records.push(record.toJSON());
        console.log(`Created ${Model.name} ${i + 1}:`, record.toJSON());
      }
      return records;
    };

    // ---- Testing Multiple Roles ----
    console.log("---- Testing Multiple Roles ----");
    const roles = await createMultiple(Role, 3, (i) => ({
      role_name: `Role_${i + 1}`,
    }));
    console.log(
      "All roles created:",
      roles.map((r) => r.role_id)
    );

    // ---- Testing Multiple Tickets ----
    console.log("---- Testing Multiple Tickets ----");
    const tickets = await createMultiple(Ticket, 3, (i) => ({
      title: `Test Ticket ${i + 1}`,
      description: `This is ticket number ${i + 1}`,
      status: "open",
      category: "grade appeal",
      created_by: 1, // Assuming a user_id of 1
      assigned_to: null,
    }));
    console.log(
      "All tickets created:",
      tickets.map((t) => t.ticket_id)
    );

    // ---- Testing Multiple Comments ----
    console.log("---- Testing Multiple Comments ----");
    const comments = await createMultiple(Comment, 3, (i) => ({
      ticket_id: tickets[i].ticket_id,
      user_id: 1, // Assuming a user_id of 1
      content: `This is comment number ${i + 1}`,
    }));
    console.log(
      "All comments created:",
      comments.map((c) => c.comment_id)
    );

    // ---- Testing Multiple Ticket-Students ----
    console.log("---- Testing Multiple Ticket-Students ----");
    const ticketStudents = await createMultiple(TicketStudent, 3, (i) => ({
      ticket_id: tickets[i].ticket_id,
      student_id: i + 1, // Assuming different user_ids for each
    }));
    console.log(
      "All ticket-student relationships created:",
      ticketStudents.map((ts) => ({
        ticket_id: ts.ticket_id,
        student_id: ts.student_id,
      }))
    );

    // ---- Testing Multiple Ticket Histories ----
    console.log("---- Testing Multiple Ticket Histories ----");
    const ticketHistories = await createMultiple(TicketHistory, 3, (i) => ({
      ticket_id: tickets[i].ticket_id,
      changed_by: 1, // Assuming a user_id of 1
      old_status: "open",
      new_status: "resolved",
    }));
    console.log(
      "All ticket histories created:",
      ticketHistories.map((th) => th.history_id)
    );

    // ---- Testing Multiple Notifications ----
    console.log("---- Testing Multiple Notifications ----");
    const notifications = await createMultiple(Notification, 3, (i) => ({
      user_id: 1, // Assuming a user_id of 1
      ticket_id: tickets[i].ticket_id,
      message: `Notification for ticket ${i + 1}`,
    }));
    console.log(
      "All notifications created:",
      notifications.map((n) => n.notification_id)
    );

    // Start Express Server for later usage
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();
