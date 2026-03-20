const { validationResult } = require("express-validator");
const Lesson = require("../models/Lesson");
const Subject = require("../models/Subject");

const getLessons = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const filter = subjectId ? { subjectId } : {};
    const lessons = await Lesson.find(filter).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    next(err);
  }
};

const getLessonById = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

const createLesson = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subjectId } = req.body;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(400).json({ message: "Subject does not exist." });
    }

    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findByIdAndUpdate(lessonId, req.body, {
      new: true,
    });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findByIdAndDelete(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }
    res.json({ message: "Lesson deleted." });
  } catch (err) {
    next(err);
  }
};

const addPart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    lesson.parts.push(req.body);
    await lesson.save();

    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};

const updatePart = async (req, res, next) => {
  try {
    const { lessonId, partId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    const part = lesson.parts.id(partId);
    if (!part) {
      return res.status(404).json({ message: "Part not found." });
    }

    Object.assign(part, req.body);
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

const deletePart = async (req, res, next) => {
  try {
    const { lessonId, partId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    const part = lesson.parts.id(partId);
    if (!part) {
      return res.status(404).json({ message: "Part not found." });
    }

    await part.deleteOne();
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  addPart,
  updatePart,
  deletePart,
};
