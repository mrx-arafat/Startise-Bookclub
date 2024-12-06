const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { validateUser, validateAdmin } = require("../utils/jwt");

// Create a new user (Admin only)
router.post("/", validateUser, validateAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user with isAdmin set to false
    const user = new User({
      name,
      email,
      password,
      isAdmin: false,
    });

    // Save user to database
    await user.save();

    // Return success but don't send password
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

module.exports = router;
