const User = require("../models/User");
const { validationResult } = require("express-validator");

const getUsers = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = { role: "student" };
    if (status === "approved") filter.isApproved = true;
    if (status === "pending") filter.isApproved = false;

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User approved.", user: updated });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, approveUser, deleteUser };
