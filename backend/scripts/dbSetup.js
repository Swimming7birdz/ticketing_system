const { Pool } = require("pg");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Force SSL off for local database
});

// Function to create tables before inserting data
async function createTables() {
  console.log("Creating tables...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teams (
      team_id SERIAL PRIMARY KEY,
      team_name VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teammembers (
      team_id INT REFERENCES teams(team_id) ON DELETE CASCADE,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      PRIMARY KEY (team_id, user_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tickets (
      ticket_id SERIAL PRIMARY KEY,
      student_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      team_id INT REFERENCES teams(team_id) ON DELETE CASCADE,
      issue_description TEXT NOT NULL,
      sponsor_name VARCHAR(255),
      section VARCHAR(255),
      issue_type VARCHAR(50),
      status VARCHAR(50)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ticketassignments (
      ticket_id INT REFERENCES tickets(ticket_id) ON DELETE CASCADE,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      PRIMARY KEY (ticket_id, user_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ticketcommunications (
      communication_id SERIAL PRIMARY KEY,
      ticket_id INT REFERENCES tickets(ticket_id) ON DELETE CASCADE,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      message TEXT NOT NULL
    );
  `);

  console.log("Tables created successfully!");
}

// Function to hash passwords
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Function to insert users
async function insertUsers() {
  console.log("Inserting users...");
  const roles = ["student", "TA", "admin"];
  const defaultPassword = "password";
  const hashedPassword = await hashPassword(defaultPassword);

  const userPromises = Array.from({ length: 20 }).map(async (_, i) => {
    const name = faker.person.firstName() + " " + faker.person.lastName();
    const email = i === 0 ? "admin1@asu.edu" : faker.internet.email();
    const role = i === 0 ? "admin" : roles[Math.floor(Math.random() * roles.length)];
    return pool.query(
      "INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4)",
      [name, email, role, hashedPassword]
    );
  });

  await Promise.all(userPromises);
  console.log("Users inserted!");
}

// Function to insert teams
async function insertTeams() {
  console.log("Inserting teams...");
  const teamPromises = Array.from({ length: 5 }).map(() => {
    const teamName = faker.company.name();
    return pool.query("INSERT INTO teams (team_name) VALUES ($1)", [teamName]);
  });

  await Promise.all(teamPromises);
  console.log("Teams inserted!");
}

// Function to insert team members
async function insertTeamMembers() {
  console.log("Inserting team members...");
  const students = await pool.query("SELECT user_id FROM users WHERE role = 'student'");
  const teams = await pool.query("SELECT team_id FROM teams");

  const teamMemberPromises = students.rows.map((student) => {
    const team = teams.rows[Math.floor(Math.random() * teams.rows.length)];
    return pool.query(
      "INSERT INTO teammembers (team_id, user_id) VALUES ($1, $2)",
      [team.team_id, student.user_id]
    );
  });

  await Promise.all(teamMemberPromises);
  console.log("Team members inserted!");
}

// Function to insert tickets
async function insertTickets() {
  console.log("Inserting tickets...");
  const issueTypes = ["Bug", "Feature Request", "Question", "Other"];
  const statuses = ["new", "ongoing", "resolved"];

  const students = await pool.query("SELECT user_id FROM users WHERE role = 'student'");
  const teams = await pool.query("SELECT team_id FROM teams");

  const ticketPromises = Array.from({ length: 10 }).map(() => {
    const student = students.rows[Math.floor(Math.random() * students.rows.length)];
    const team = teams.rows[Math.floor(Math.random() * teams.rows.length)];
    const issueDescription = faker.lorem.sentence();
    const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const sponsorName = "Sponsor Name";
    const section = "My Section";

    return pool.query(
      "INSERT INTO tickets (student_id, team_id, issue_description, sponsor_name, section, issue_type, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [student.user_id, team.team_id, issueDescription, sponsorName, section, issueType, status]
    );
  });

  await Promise.all(ticketPromises);
  console.log("Tickets inserted!");
}

// Function to insert ticket assignments
async function insertTicketAssignments() {
  console.log("Inserting ticket assignments...");
  const tas = await pool.query("SELECT user_id FROM users WHERE role = 'TA'");
  const students = await pool.query("SELECT user_id FROM users WHERE role = 'student'");
  const tickets = await pool.query("SELECT ticket_id FROM tickets");

  const eligibleUsers = [...tas.rows, ...students.rows.slice(0, Math.floor(students.rows.length / 2))];

  const assignmentPromises = tickets.rows.map(async (ticket) => {
    const user = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

    // Check if assignment already exists
    const existingAssignment = await pool.query(
      "SELECT * FROM ticketassignments WHERE ticket_id = $1 AND user_id = $2",
      [ticket.ticket_id, user.user_id]
    );

    if (existingAssignment.rows.length === 0) {
      return pool.query(
        "INSERT INTO ticketassignments (ticket_id, user_id) VALUES ($1, $2)",
        [ticket.ticket_id, user.user_id]
      );
    }
  });

  await Promise.all(assignmentPromises);
  console.log("Ticket assignments inserted!");
}

// Function to insert ticket communications
async function insertTicketCommunications() {
  console.log("Inserting ticket communications...");
  const tickets = await pool.query("SELECT ticket_id FROM tickets");
  const users = await pool.query("SELECT user_id FROM users");

  const communicationPromises = Array.from({ length: 30 }).map(() => {
    const ticket = tickets.rows[Math.floor(Math.random() * tickets.rows.length)];
    const user = users.rows[Math.floor(Math.random() * users.rows.length)];
    const message = faker.lorem.paragraph();
    return pool.query(
      "INSERT INTO ticketcommunications (ticket_id, user_id, message) VALUES ($1, $2, $3)",
      [ticket.ticket_id, user.user_id, message]
    );
  });

  await Promise.all(communicationPromises);
  console.log("Ticket communications inserted!");
}

// Main function to execute all insertions
async function generateData() {
  try {
    await createTables();
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



