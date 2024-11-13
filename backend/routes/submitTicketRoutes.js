const express = require("express");
const submitTicketController = require("../controllers/submitTicketController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/")