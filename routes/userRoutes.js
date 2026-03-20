const { Router } = require("express");
const {
  getUsers,
  approveUser,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = Router();

router.get("/", auth, admin, getUsers);
router.patch("/approve/:id", auth, admin, approveUser);
router.delete("/:id", auth, admin, deleteUser);

module.exports = router;
