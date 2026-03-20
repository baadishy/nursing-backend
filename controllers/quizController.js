const { validationResult } = require("express-validator");
const Quiz = require("../models/Quiz");
const Lesson = require("../models/Lesson");
const Question = require("../models/Question");

const createQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lessonId } = req.body;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(400).json({ message: "Lesson does not exist." });
    }

    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};

const getQuizByLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const quiz = await Quiz.findOne({ lessonId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found for this lesson." });
    }

    const questions = await Question.find({ quizId: quiz._id }).sort({ createdAt: 1 });
    res.json({ ...quiz.toObject(), questions });
  } catch (err) {
    next(err);
  }
};

module.exports = { createQuiz, getQuizByLesson };
