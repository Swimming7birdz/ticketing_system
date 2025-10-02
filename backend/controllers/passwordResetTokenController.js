const User = require("../models/User");
const PasswordResetToken = require("../models/passwordresettoken");
const sendEmail = require("../services/emailService");
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const crypto = require("crypto");

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

        //update table with token
        await PasswordResetToken.create({ //modify
            user_id: user.user_id,
            token_hash: tokenHash,
            expires_at: new Date(Date.now() + 3600000), // 1 hour from now
            // used defaults as false
        });

        const resetLink = `${baseURL}/resetpassword?token=${rawToken}`; //modify

        //send email with token
        await sendEmail(
            user.email,
            "Password Reset",
            `Your password reset link: ${resetLink}\nThis link will expire in 1 hour.`
        );
        res.status(200).json({ message: "Password reset email sent." });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
