const OfficeHours = require("../models/OfficeHours");
const User = require("../models/User");

exports.getOfficeHoursByTAId = async (req, res) => {
  try {
    const officeHours = await OfficeHours.findOne({
      where: { ta_id: req.params.user_id },
    });
    if (!officeHours) {
      return res.json({}); // return empty object
    }
    res.json(officeHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignOfficeHours = async (req, res) => {
  const { office_hours } = req.body;
  const ta_id = req.params.user_id;

  try {
    const existing = await OfficeHours.findOne({ where: { ta_id } });
    if (existing) {
      
      await existing.update({ office_hours });
      res.status(200).json({ message: "Office hours updated successfully." });
    } else {
      
      await OfficeHours.create({ta_id, office_hours });
      res.status(201).json({ message: "Office hours created successfully." });
    }
  } catch (error) {
    console.error("Error assigning office hours:", error);
    res.status(500).json({ error: error.message });
  }
};
