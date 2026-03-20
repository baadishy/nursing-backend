const { body } = require("express-validator");

const createLessonValidation = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("titleAr").optional().trim(),
  body("subjectId").notEmpty().withMessage("Subject id is required."),
];

const lessonPartValidation = [
  body("title").trim().notEmpty().withMessage("Part title is required."),
  body("titleAr").optional().trim(),
  body("textAr").optional().trim(),
];

const quizValidation = [
  body("lessonId").notEmpty().withMessage("Lesson id is required."),
  body("title").trim().notEmpty().withMessage("Quiz title is required."),
];

const questionValidation = [
  body("quizId").notEmpty().withMessage("Quiz id is required."),
  body("question").trim().notEmpty().withMessage("Question text is required."),
  body("options")
    .isArray({ min: 2 })
    .withMessage("Options must include at least two items."),
  body("correctAnswer")
    .notEmpty()
    .withMessage("correctAnswer is required."),
];

const quizAttemptValidation = [
  body("quizId").notEmpty().withMessage("Quiz id is required."),
  body("answers")
    .isArray({ min: 1 })
    .withMessage("answers must be a non-empty array."),
  body("answers.*.questionId")
    .notEmpty()
    .withMessage("questionId is required for each answer."),
  body("answers.*.selectedAnswer")
    .notEmpty()
    .withMessage("selectedAnswer is required for each answer."),
];

module.exports = {
  createLessonValidation,
  lessonPartValidation,
  quizValidation,
  questionValidation,
  quizAttemptValidation,
};
