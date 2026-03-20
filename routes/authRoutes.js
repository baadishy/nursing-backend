const { Router } = require("express");
const { signup, login } = require("../controllers/authController");
const {
  signupValidation,
  loginValidation,
} = require("../validators/authValidator");

const router = Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

module.exports = router;
