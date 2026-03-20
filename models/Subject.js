const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, trim: true, default: "" },
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    description: { type: String, default: "" },
    descriptionAr: { type: String, default: "" },
  },
  { timestamps: true }
);

subjectSchema.index({ categoryIds: 1 });

module.exports = mongoose.model("Subject", subjectSchema);
