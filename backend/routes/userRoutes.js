const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware.isAdmin, userController.getAllUsers);
router.get("/:user_id", userController.getUserById);
router.post("/", authMiddleware.isAdmin, userController.createUser);
router.put("/:user_id", authMiddleware.isAdmin, userController.updateUser);
router.delete("/:user_id", authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;