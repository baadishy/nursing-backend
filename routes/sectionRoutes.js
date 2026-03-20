const { Router } = require("express");
const { body } = require("express-validator");
const {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = Router();

router.get("/", getSections);
router.post(
  "/",
  auth,
  admin,
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("nameAr").optional().trim(),
    body("descriptionAr").optional().trim(),
    body("grade")
      .trim()
      .isIn(["1", "2", "3"])
      .withMessage("Grade must be one of 1, 2, or 3."),
  ],
  createSection
);
router.patch(
  "/:id",
  auth,
  admin,
  [
    body("nameAr").optional().trim(),
    body("descriptionAr").optional().trim(),
    body("grade")
      .optional()
      .trim()
      .isIn(["1", "2", "3"])
      .withMessage("Grade must be one of 1, 2, or 3."),
  ],
  updateSection
);
router.delete("/:id", auth, admin, deleteSection);

module.exports = router;
