const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const {
  login,
  register,
  adminLogin,
} = require("../controllers/authController");

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", login);

// @route   POST api/auth/admin/login
// @desc    Authenticate admin user & get token
// @access  Public
router.post("/admin/login", adminLogin);

// @route   GET api/auth/verify
// @desc    Verify token and get user data
// @access  Private
router.get("/verify", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
