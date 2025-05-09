const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");

const router = express.Router();

// API endpoint to encrypt a password
router.post(
    "/",
    authMiddleware.verifyToken,
    async (req, res) => {
        try {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ error: "Password is required" });
            }
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Return the hashed password
            res.json({ hashedPassword });
        } catch (error) {
            console.error("Error encrypting password:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
});

module.exports = router;