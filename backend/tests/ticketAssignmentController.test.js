const test = require("node:test");
const assert = require("node:assert/strict");

const controller = require("../controllers/ticketAssignmentController");
const TicketAssignment = require("../models/TicketAssignment");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

const originals = {
  findAssignment: TicketAssignment.findOne,
  findOrCreate: TicketAssignment.findOrCreate,
  findTicket: Ticket.findByPk,
  findUser: User.findByPk,
};

const response = () => ({
  statusCode: 200,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const request = ({ role, userId, ticketId = 101, assigneeId = 20 }) => ({
  params: { ticket_id: String(ticketId) },
  body: { user_id: assigneeId },
  user: { role, id: userId },
});

test.afterEach(() => {
  TicketAssignment.findOne = originals.findAssignment;
  TicketAssignment.findOrCreate = originals.findOrCreate;
  Ticket.findByPk = originals.findTicket;
  User.findByPk = originals.findUser;
});

test("an assigned TA can share multiple tickets to multiple TA accounts", async () => {
  const created = [];
  Ticket.findByPk = async () => ({ student_id: 1 });
  User.findByPk = async (id) => ({ user_id: id, role: "TA" });
  TicketAssignment.findOne = async ({ where }) => (
    where.user_id === 10 && [101, 102].includes(where.ticket_id) ? { ticket_assignment_id: 1 } : null
  );
  TicketAssignment.findOrCreate = async ({ defaults }) => {
    created.push(defaults);
    return [{ ...defaults }, true];
  };

  // This mirrors two group-share submissions: each batch sends every selected
  // ticket to one TA, then the same tickets are shared with another TA.
  for (const [ticketId, assigneeId] of [[101, 20], [102, 20], [101, 21], [102, 21]]) {
    const res = response();
    await controller.assignTicket(request({ role: "TA", userId: 10, ticketId, assigneeId }), res);
    assert.equal(res.statusCode, 201);
  }

  assert.deepEqual(created, [
    { ticket_id: 101, user_id: 20 },
    { ticket_id: 102, user_id: 20 },
    { ticket_id: 101, user_id: 21 },
    { ticket_id: 102, user_id: 21 },
  ]);
});

test("duplicate shares are reported without replacing an assignment", async () => {
  Ticket.findByPk = async () => ({ student_id: 1 });
  User.findByPk = async () => ({ role: "TA" });
  TicketAssignment.findOne = async () => ({ ticket_assignment_id: 1 });
  TicketAssignment.findOrCreate = async () => [{ ticket_assignment_id: 2 }, false];

  const res = response();
  await controller.assignTicket(request({ role: "TA", userId: 10 }), res);

  assert.equal(res.statusCode, 409);
  assert.deepEqual(res.body, { error: "Assignment already exists" });
});

test("a TA cannot share a ticket that is not assigned to them", async () => {
  Ticket.findByPk = async () => ({ student_id: 1 });
  User.findByPk = async () => ({ role: "TA" });
  TicketAssignment.findOne = async () => null;

  const res = response();
  await controller.assignTicket(request({ role: "TA", userId: 10 }), res);

  assert.equal(res.statusCode, 403);
  assert.match(res.body.error, /assigned to you/);
});

test("graders cannot initiate sharing", async () => {
  Ticket.findByPk = async () => ({ student_id: 1 });
  User.findByPk = async () => ({ role: "TA" });

  const res = response();
  await controller.assignTicket(request({ role: "grader", userId: 30 }), res);

  assert.equal(res.statusCode, 403);
  assert.match(res.body.error, /not allowed/);
});

test("a student can still make the initial assignment for their own ticket", async () => {
  Ticket.findByPk = async () => ({ student_id: 1 });
  User.findByPk = async () => ({ role: "TA" });
  TicketAssignment.findOrCreate = async ({ defaults }) => [{ ...defaults }, true];

  const res = response();
  await controller.assignTicket(request({ role: "student", userId: 1 }), res);

  assert.equal(res.statusCode, 201);
});
