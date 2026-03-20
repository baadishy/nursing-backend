const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_ENDS_IN } = require("../config/env");

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ENDS_IN || "7d" });
}

module.exports = generateToken;
