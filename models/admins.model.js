const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^01[0,1,2,5][0-9]{8}$/,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
});

const Admins = mongoose.model("Admins", adminSchema);

module.exports = Admins;
