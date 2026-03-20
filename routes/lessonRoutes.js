const { Router } = require("express");
const {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  addPart,
  updatePart,
  deletePart,
} = require("../controllers/lessonController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createLessonValidation,
  lessonPartValidation,
} = require("../validators/lessonValidator");

const router = Router();

// list lessons for subject
router.get("/lessons/:subjectId", getLessons);
// single lesson fetch
router.get("/lesson/:lessonId", getLessonById);

// lesson CRUD (admin only)
router.post("/lesson", auth, admin, createLessonValidation, createLesson);
router.patch("/lesson/:lessonId", auth, admin, updateLesson);
router.delete("/lesson/:lessonId", auth, admin, deleteLesson);

// lesson parts (admin only)
router.post(
  "/lesson/:lessonId/part",
  auth,
  admin,
  lessonPartValidation,
  addPart
);
router.patch("/lesson/:lessonId/part/:partId", auth, admin, updatePart);
router.delete("/lesson/:lessonId/part/:partId", auth, admin, deletePart);

module.exports = router;
