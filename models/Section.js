const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    // Grade is a string "1" | "2" | "3" to keep API payloads consistent with incoming form values.
    grade: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    descriptionAr: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Allow the same section name to repeat across grades but keep it unique within a grade.
sectionSchema.index({ grade: 1, name: 1 }, { unique: true });
// Keep list ordering stable by grade first, then explicit order value.
sectionSchema.index({ grade: 1, order: 1 });

module.exports = mongoose.model("Section", sectionSchema);
