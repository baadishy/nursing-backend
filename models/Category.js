const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, trim: true, default: "" },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    description: { type: String, default: "" },
    descriptionAr: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ sectionId: 1, order: 1 });

module.exports = mongoose.model("Category", categorySchema);
