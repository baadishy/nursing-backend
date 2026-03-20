const { validationResult } = require("express-validator");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

const createQuestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quizId, options, correctAnswer } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json({ message: "Quiz does not exist." });
    }

    if (!options.includes(correctAnswer)) {
      return res
        .status(400)
        .json({ message: "correctAnswer must be one of the options." });
    }

    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.options && updates.correctAnswer && !updates.options.includes(updates.correctAnswer)) {
      return res
        .status(400)
        .json({ message: "correctAnswer must be one of the options." });
    }

    const question = await Question.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.json(question);
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.json({ message: "Question deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
