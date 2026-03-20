const { Router } = require("express");
const { body } = require("express-validator");
const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = Router();

router.get("/:categoryId", getSubjects);
router.get("/", getSubjects);
router.post(
  "/",
  auth,
  admin,
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("nameAr").optional().trim(),
    body("descriptionAr").optional().trim(),
    body("categoryIds")
      .isArray({ min: 1 })
      .withMessage("At least one categoryId is required."),
  ],
  createSubject
);
router.patch(
  "/:id",
  auth,
  admin,
  [
    body("nameAr").optional().trim(),
    body("descriptionAr").optional().trim(),
  ],
  updateSubject
);
router.delete("/:id", auth, admin, deleteSubject);

module.exports = router;
