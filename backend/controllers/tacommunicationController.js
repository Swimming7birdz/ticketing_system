const TaCommunication = require("../models/TaCommunication");
const User = require("../models/User");

exports.getAllCommunicationsByTicketId = async (req, res) => {
    try {
        const communications = await TaCommunication.findAll({
            where: { ticket_id: req.params.ticket_id }
        });

        // ✅ If no communications exist, return an empty array instead of breaking
        if (!communications || communications.length === 0) {
            return res.json([]);
        }

        await Promise.all(communications.map(async (communication) => {
            const user = await User.findByPk(communication.dataValues.user_id);
            if (user) {
                communication.dataValues.user_name = user.dataValues.name;
            } else {
                communication.dataValues.user_name = "Unknown User"; // ✅ Prevents a crash if the user is missing
            }
        }));

        res.json(communications);
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.createCommunication = async (req, res) => {
    try {
        const communication = await TaCommunication.create({
            ticket_id: req.params.ticket_id,
            user_id: req.body.user_id,
            message: req.body.message,
        });
        res.status(201).json(communication);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};