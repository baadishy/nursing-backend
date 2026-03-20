const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    timeLimit: { type: Number, default: 0 }, // minutes
  },
  { timestamps: true }
);

quizSchema.index({ lessonId: 1 });

module.exports = mongoose.model("Quiz", quizSchema);
