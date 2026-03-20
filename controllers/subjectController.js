const { validationResult } = require("express-validator");
const Subject = require("../models/Subject");
const Category = require("../models/Category");

const getSubjects = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const filter = categoryId ? { categoryIds: categoryId } : {};
    const subjects = await Subject.find(filter).sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    next(err);
  }
};

const createSubject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryIds } = req.body;
    const categories = await Category.countDocuments({ _id: { $in: categoryIds } });
    if (categories !== categoryIds.length) {
      return res.status(400).json({ message: "One or more categories do not exist." });
    }

    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (err) {
    next(err);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }
    res.json(subject);
  } catch (err) {
    next(err);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }
    res.json({ message: "Subject deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};
