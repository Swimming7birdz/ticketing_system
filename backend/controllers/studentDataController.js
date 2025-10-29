const StudentData = require("../models/StudentData");

exports.getStudentDataByUserId = async (req, res) => {
    try {
        const studentData = await StudentData.findOne({ where: { user_id: req.params.user_id } });
        if (studentData) {
            res.json(studentData);
        } else {
            res.status(404).json({ error: "Student data not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStudentData = async (req, res) => {
    try {
        const studentData = await StudentData.create(req.body);
        res.status(201).json(studentData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStudentData = async (req, res) => {
    try {
        const studentData = await StudentData.findOne({ where: { user_id: req.params.user_id } });
        if (studentData) {
            await studentData.update(req.body);
            res.json(studentData);
        } else {
            res.status(404).json({ error: "Student data not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};