const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    question: { type: String, required: true },
    questionAr: { type: String, default: "" },
    options: [{ type: String, required: true }],
    optionsAr: [{ type: String }],
    correctAnswer: { type: String, required: true },
    correctAnswerAr: { type: String, default: "" },
    explanation: { type: String, default: "" },
    explanationAr: { type: String, default: "" },
  },
  { timestamps: true }
);

questionSchema.index({ quizId: 1 });

module.exports = mongoose.model("Question", questionSchema);
