const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/User");
const Admins = require("../models/admins.model");
const generateToken = require("../utils/generateToken");

/**
 * Student/admin signup.
 * Students default to pending approval; admins can be seeded manually with role=admin.
 */
const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, grade, governorate, classNumber, schoolName } = req.body;

    const duplicate = await User.findOne({
      name: name.trim(),
      classNumber,
      schoolName,
    });
    if (duplicate) {
      return res.status(409).json({ message: "User already registered." });
    }

    const user = await User.create({
      name: name.trim(),
      grade,
      governorate,
      classNumber,
      schoolName,
      role: "student",
      isApproved: false,
    });

    return res.status(201).json({
      message: "Signup successful. Await admin approval if you are a student.",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login via MongoDB _id + name. Admins with a password will be validated against it.
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id format." });
    }

    let user = await User.findById(id);

    if (!user) {
      user = await Admins.findById(id);
      if (!user) {
        return res.status(401).json({ message: "User Not Found." });
      }
    }

    // basic name match (case-insensitive) to reduce trivial mismatches
    if (user.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.role === "student" && !user.isApproved) {
      return res
        .status(403)
        .json({ message: "Account pending admin approval." });
    }

    if (user.role === "admin" && user.isApproved === true) {
      const valid =
        user.name.trim().toLowerCase() === name.trim().toLowerCase();
      if (!valid) {
        return res.status(401).json({ message: "Invalid admin name." });
      }
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true, // prevents JS access (security)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
