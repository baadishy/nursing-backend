const { validationResult } = require("express-validator");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");

const submitQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json({ message: "Quiz does not exist." });
    }

    const questions = await Question.find({ quizId });
    const answerMap = new Map();
    questions.forEach((q) => answerMap.set(String(q._id), q));

    let correctCount = 0;
    const evaluatedAnswers = answers.map(({ questionId, selectedAnswer }) => {
      const question = answerMap.get(String(questionId));
      const isCorrect = question
        ? question.correctAnswer === selectedAnswer
        : false;
      if (isCorrect) correctCount += 1;
      return { questionId, selectedAnswer, isCorrect };
    });

    const score =
      questions.length === 0
        ? 0
        : Math.round((correctCount / questions.length) * 100);

    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      quizId,
      answers: evaluatedAnswers,
      score,
    });

    res.status(201).json({ message: "Quiz submitted.", attempt });
  } catch (err) {
    next(err);
  }
};

const getResults = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const requesterIsOwner = String(req.user.id) === String(userId);
    const requesterIsAdmin = req.user.role === "admin";

    if (!requesterIsOwner && !requesterIsAdmin) {
      return res.status(403).json({ message: "Not authorized to view results." });
    }

    const attempts = await QuizAttempt.find({ userId })
      .populate("quizId", "title lessonId")
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitQuiz, getResults };
