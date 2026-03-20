const { Router } = require("express");
const { createQuiz, getQuizByLesson } = require("../controllers/quizController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { quizValidation } = require("../validators/lessonValidator");

const router = Router();

router.post("/quiz", auth, admin, quizValidation, createQuiz);
router.get("/quiz/:lessonId", auth, getQuizByLesson);

module.exports = router;
