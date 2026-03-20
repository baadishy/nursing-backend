const { Router } = require("express");
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { questionValidation } = require("../validators/lessonValidator");

const router = Router();

router.post("/question", auth, admin, questionValidation, createQuestion);
router.patch("/question/:id", auth, admin, updateQuestion);
router.delete("/question/:id", auth, admin, deleteQuestion);

module.exports = router;
