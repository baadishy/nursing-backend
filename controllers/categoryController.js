const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const Section = require("../models/Section");

const getCategories = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const filter = sectionId ? { sectionId } : {};
    const categories = await Category.find(filter).sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sectionId } = req.body;
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(400).json({ message: "Section does not exist." });
    }

    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json({ message: "Category deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
