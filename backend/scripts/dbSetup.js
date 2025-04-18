const { Pool } = require("pg");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Initialize connection pool
const pool = new Pool({
  connectionString:

  	"postgresql://test_user:testpassword@127.0.0.1:5432/test_database?sslmode=disable",
	ssl: { rejectUnauthorized: false }, // Only needed if using SSL in production
});

// Helper function to hash passwords
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

faker.seed(123) // so data stays the same even after resetting database

// Generate data for Users table
async function insertUsers() {
  const roles = ["student", "TA", "admin"];
  const defaultPassword = "password";
  const hashedPassword = await hashPassword(defaultPassword);

  const userPromises = Array.from({ length: 20 }).map(async (_, i) => {

    // const asu_id = faker.random.alphaNumeric(10);

    const firstName =  faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = firstName + " " + lastName; // Corrected name generation
    const email = i === 0 ? "admin1@asu.edu" : faker.internet.email({firstName: firstName, lastName: lastName, provider: 'asu.edu'}); // Make the first user a specific admin, the rest will be randomly generated with asu emails

    const role =
      i === 0 ? "admin" : roles[Math.floor(Math.random() * roles.length)];
    return pool.query(
      "INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4)",
      [name, email, role, hashedPassword, asu_id]
    );
  });

  await Promise.all(userPromises);
  console.log("Inserted users");
}

// Generate data for Teams table
async function insertTeams() {
  const teamPromises = Array.from({ length: 5 }).map(() => {
    const teamName = faker.company.name(); // Updated to faker.company.name()
    return pool.query("INSERT INTO teams (team_name) VALUES ($1)", [teamName]);
  });

  await Promise.all(teamPromises);
  console.log("Inserted teams");
}

// Generate data for TeamMembers table
async function insertTeamMembers() {
  const students = await pool.query(
    "SELECT user_id FROM users WHERE role = 'student'"
  );
  const teams = await pool.query("SELECT team_id FROM teams");

  const teamMemberPromises = students.rows.map((student) => {
    const team = teams.rows[Math.floor(Math.random() * teams.rows.length)];
    return pool.query(
      "INSERT INTO teammembers (team_id, user_id) VALUES ($1, $2)",
      [team.team_id, student.user_id]
    );
  });

  await Promise.all(teamMemberPromises);
  console.log("Inserted team members");
}

// Generate data for Tickets table
async function insertTickets() {
  const issueTypes = ["Bug", "Feature Request", "Question", "Other"];
  const statuses = ["new", "ongoing", "resolved"];

  const students = await pool.query(
    "SELECT user_id FROM users WHERE role = 'student'"
  );
  const teams = await pool.query("SELECT team_id FROM teams");

  const ticketPromises = Array.from({ length: 10 }).map(() => {
    const student =
      students.rows[Math.floor(Math.random() * students.rows.length)];
    const team = teams.rows[Math.floor(Math.random() * teams.rows.length)];
    const issueDescription = faker.lorem.sentence();
    const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const sponsorName = "Sponsor Name";
    const section = "My Section";
    const asu_id = faker.random.alphaNumeric(10);
    return pool.query(
      "INSERT INTO tickets (student_id, team_id, issue_description, sponsor_name, section, issue_type, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        student.user_id,
        team.team_id,
        issueDescription,
        sponsorName,
        section,
        issueType,
        status,
        asu_id,
      ]
    );
  });

  await Promise.all(ticketPromises);
  console.log("Inserted tickets");
}

// Generate data for TicketAssignments table, including TAs and some students
async function insertTicketAssignments() {
  const tas = await pool.query("SELECT user_id FROM users WHERE role = 'TA'");
  const students = await pool.query(
    "SELECT user_id FROM users WHERE role = 'student'"
  );
  const tickets = await pool.query("SELECT ticket_id FROM tickets");

  // Combine TAs and a random subset of students for assignment
  const eligibleUsers = [
    ...tas.rows,
    ...students.rows.slice(0, Math.floor(students.rows.length / 2)),
  ];

  const assignmentPromises = tickets.rows.map((ticket) => {
    const user =
      eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
    return pool.query(
      "INSERT INTO ticketassignments (ticket_id, user_id) VALUES ($1, $2)",
      [ticket.ticket_id, user.user_id]
    );
  });

  await Promise.all(assignmentPromises);
  console.log("Inserted ticket assignments");
}

// Generate data for TicketCommunications table
async function insertTicketCommunications() {
  const tickets = await pool.query("SELECT ticket_id FROM tickets");
  const users = await pool.query("SELECT user_id FROM users");

  const communicationPromises = Array.from({ length: 30 }).map(() => {
    const ticket =
      tickets.rows[Math.floor(Math.random() * tickets.rows.length)];
    const user = users.rows[Math.floor(Math.random() * users.rows.length)];
    const message = faker.lorem.paragraph();
    return pool.query(
      "INSERT INTO ticketcommunications (ticket_id, user_id, message) VALUES ($1, $2, $3)",
      [ticket.ticket_id, user.user_id, message]
    );
  });

  await Promise.all(communicationPromises);
  console.log("Inserted ticket communications");
}
/*
async function insertSchedule() {
  const users = await pool.query("SELECT user_id FROM users WHERE role = 'TA'");

  const schedulePromises = Array.from({ length: 30 }).map(() => {
    const ticket =
      tickets.rows[Math.floor(Math.random() * tickets.rows.length)];
    const user = users.rows[Math.floor(Math.random() * users.rows.length)];
    const message = faker.lorem.paragraph();
    return pool.query(
      "INSERT INTO ticketcommunications (ticket_id, user_id, message) VALUES ($1, $2, $3)",
      [ticket.ticket_id, user.user_id, message]
    );
  });

  await Promise.all(communicationPromises);
  console.log("Inserted TA schedules");
}
*/

// Main function to execute all insertions
async function generateData() {
  try {
    await insertUsers();

    await insertTeams();
    await insertTeamMembers();
    await insertTickets();
    await insertTicketAssignments();
    await insertTickets();
    await insertTicketAssignments();
    await insertTickets();
    await insertTicketAssignments();
    await insertTickets();
    await insertTicketAssignments();
    await insertTickets();
    await insertTicketAssignments();
    await insertTicketCommunications();

    console.log("Fake data inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await pool.end();
  }
}

generateData();
