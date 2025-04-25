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

// Get all users (Admin only)
router.get("/", validateUser, validateAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res
      .status(500)
      .json({ message: "Error getting users", error: error.message });
  }
});


// Delete user (Admin only)
router.delete("/:id", validateUser, validateAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

// Toggle admin status (Admin only)
router.put("/:id/toggle-admin", validateUser, validateAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle admin status
    user.isAdmin = !user.isAdmin;
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Toggle admin error:", error);
    res
      .status(500)
      .json({ message: "Error toggling admin status", error: error.message });
  }
});

module.exports = router;
