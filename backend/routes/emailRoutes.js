const express = require('express');
const sendEmail = require('../services/emailService');

const router = express.Router();

router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;