const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
    enum: ['1', '2', '3'],
  },
  class: {
    type: String,
    required: true,
  },
  governorate: {
    type: String,
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  role: {
    type: String,
    enum: ['student'],
    default: 'student',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
