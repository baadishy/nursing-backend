const Users = require("../models/users.model");
const Admins = require("../models/admins.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET, JWT_ENDS_IN } = require("../config/env");
const {
  elMinya_B,
  elMinya_G,
  elashmounin,
  elfekria,
  etlidm,
  aba,
  bniMazar,
  eledwa,
  maghagha,
  Matai_B,
  Matai_G,
  zohra,
} = require("../config/schools");

const SCHOOL_CODES = {
  elMinya_B,
  elMinya_G,
  elashmounin,
  elfekria,
  etlidm,
  aba,
  bniMazar,
  eledwa,
  maghagha,
  Matai_B,
  Matai_G,
  zohra,
};

const signUp = async (req, res, next) => {
  try {
    const { name, school, grade, class: classNumber, governorate } = req.body;

    if (!name || !school || !grade || !classNumber || !governorate) {
      return res.status(400).json({
        success: false,
        msg: "name, school, grade, class, governorate are required",
      });
    }

    const schoolCode = SCHOOL_CODES[school];

    if (!schoolCode) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid school code" });
    }

    const formattedName = name.trim().replace(/\s+/g, "").toLowerCase();
    const uniqueId = await bcrypt.hash(`${formattedName}-${schoolCode}-${classNumber}`, 10);

    if (await Users.findOne({ uniqueId })) {
      return res
        .status(400)
        .json({ success: false, msg: "User with this ID already exists" });
    }

        const createdUser = await Users.create({
      name,
      school,
      grade,
      class: classNumber,
      governorate,
    });

    const token = jwt.sign({ id: createdUser._id }, JWT_SECRET, {
      expiresIn: JWT_ENDS_IN,
    });

    const isProd = process.env.NODE_ENV === "production";
    const secure = isProd;
    const sameSite = secure ? "none" : "lax";

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure,
      sameSite,
    });

    res.status(201).json({
      success: true,
      msg: "Sign up successful.",
      data: {
        ...createdUser
      },
    });
  } catch (err) {
    next(err);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { id, name } = req.body;
    let user = null;
    let isAdmin = false;

    if (!name || !id) {
      return res.status(400).json({
        success: false,
        msg: "Either name or Id is required for sign in",
      });
    }

    user = await Users.findOne({ _id: id, name });

    if (!user) {
      const admin = await Admins.findOne({ _id: id, name });
      if (!admin) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid credentials" });
      }
      isAdmin = true;
      user = admin;
    }

    if (!isAdmin) {
      if (user.approvalStatus === "pending") {
        return res.status(403).json({
          success: false,
          msg: "Your account is pending admin approval.",
        });
      }
      if (user.approvalStatus === "rejected") {
        return res.status(403).json({
          success: false,
          msg: "Your signup request was rejected. Contact admin.",
        });
      }
    }

    if (user._id !== id) {
      return res.status(400).json({ success: false, msg: "Invalid unique ID" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_ENDS_IN,
    });

    const isProd = process.env.NODE_ENV === "production";
    const secure = isProd;
    const sameSite = secure ? "none" : "lax";

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure,
      sameSite,
    });

    res.status(200).json({
      success: true,
      msg: "User signed in successfully",
      isAdmin,
    });
  } catch (err) {
    next(err);
  }
};

const signOut = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  const secure = isProd;
  const sameSite = secure ? "none" : "lax";
  res.clearCookie("token", { secure, sameSite });
  res.status(200).json({ success: true, msg: "Signed out" });
};

module.exports = {
  signUp,
  signIn,
  signOut,
};
