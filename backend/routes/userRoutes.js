const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/profile",
  authMiddleware.verifyToken,
  userController.getUserProfile
);

router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.getAllUsers
);
router.get("/:user_id", authMiddleware.verifyToken, userController.getUserById);
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.createUser
);
router.put(
  "/:user_id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.updateUser
);
router.delete(
  "/:user_id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.deleteUser
);
router.get(
  "/role/:role",
  authMiddleware.verifyToken,
  userController.getUsersByRole
);

module.exports = router;
