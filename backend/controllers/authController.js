const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

      if (!user.is_enabled) {
          return res.status(403).json({ error: "Account is disabled" });
      }

    const token = jwt.sign({ id: user.user_id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  // const { name, email, password, role, asu_id } = req.body;
  // if (!asu_id || !/^\d{10}$/.test(asu_id)) {
  //   return res.status(400).json({ error: "Invalid ASU ID. It must be a 10-digit number." });
  // }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      // asu_id,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
