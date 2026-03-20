const { validationResult } = require("express-validator");
const Section = require("../models/Section");

const getSections = async (req, res, next) => {
  try {
    const sections = await Section.find({}).sort({
      grade: 1,
      order: 1,
      name: 1,
    });
    res.json(sections);
  } catch (err) {
    next(err);
  }
};

const createSection = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const section = await Section.create(req.body);
    res.status(201).json(section);
  } catch (err) {
    next(err);
  }
};

const updateSection = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const section = await Section.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!section) {
      return res.status(404).json({ message: "Section not found." });
    }
    res.json(section);
  } catch (err) {
    next(err);
  }
};

const deleteSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await Section.findByIdAndDelete(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found." });
    }
    res.json({ message: "Section deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
};
