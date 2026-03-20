const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admins = require("../models/admins.model");
const { JWT_SECRET } = require("../config/env");

/**
 * Verify JWT and attach user to the request.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await Admins.findById(decoded.id);
    }
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    next(err);
  }
};

module.exports = authMiddleware;
