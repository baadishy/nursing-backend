const { Router } = require("express");
const { submitQuiz, getResults } = require("../controllers/quizAttemptController");
const auth = require("../middleware/authMiddleware");
const { quizAttemptValidation } = require("../validators/lessonValidator");

const router = Router();

router.post("/quiz/submit", auth, quizAttemptValidation, submitQuiz);
router.get("/quiz/results/:userId", auth, getResults);

module.exports = router;
