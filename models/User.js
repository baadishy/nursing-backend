const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ALLOWED_GRADES = ["1", "2", "3", "1st", "2nd", "3rd"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: String, required: true, enum: ALLOWED_GRADES },
    governorate: { type: String, required: true, trim: true },
    classNumber: { type: String, required: true, trim: true },
    schoolName: { type: String, required: true, trim: true },
    role: { type: String, enum: ["student"], default: "student" },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for common queries
userSchema.index({ role: 1, isApproved: 1, createdAt: -1 });

// Hash password when provided
userSchema.pre("save", async function hashPassword(next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  // next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Users", userSchema);
