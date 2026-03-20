const { body } = require("express-validator");

const signupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("grade").notEmpty().withMessage("Grade is required."),
  body("governorate").trim().notEmpty().withMessage("Governorate is required."),
  body("classNumber").trim().notEmpty().withMessage("Class number is required."),
  body("schoolName").trim().notEmpty().withMessage("School name is required."),
];

const loginValidation = [
  body("id").notEmpty().withMessage("User id is required."),
  body("name").trim().notEmpty().withMessage("Name is required."),
];

module.exports = { signupValidation, loginValidation };
