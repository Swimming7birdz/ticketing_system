const User = require("../models/User");
const bcrypt = require('bcrypt');
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    // const {asu_id } = req.body;
    // if(!asu_id || !/^\d{10}$/.test(asu_id)) {
    //   return res.status(400).json({ error: "Invalid ASU ID. It must be a 10-digit number." });
    // }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // if (req.body.asu_id && !/^\d{10}$/.test(req.body.asu_id)) {
    //   return res.status(400).json({ error: "Invalid ASU ID. It must be a 10-digit number." });
    // }
    const user = await User.findByPk(req.params.user_id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(504).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    if (user) {
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(505).json({ error: error.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params; // Get the role from route parameter
    const validRoles = ["student", "TA", "admin"]; // Define valid roles

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const users = await User.findAll({ where: { role } }); // Filter users by role
    res.json(users);
  } catch (error) {
    res.status(506).json({ error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User id not provided" });
    }
    const user = await User.findByPk(userId, {
      attributes: ["user_id", "name", "email", "role"],
      // attributes: ["user_id", "name", "email", "role", "asu_id"],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // if (!/^\d{10}$/.test(user.asu_id)) {
    //   user.asu_id = "Not set";
    // }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID not provided" });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new passwords are required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await user.update({ password: hashedNewPassword });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


