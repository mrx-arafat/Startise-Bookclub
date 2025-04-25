const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user by email
    const admin = await User.findOne({
      email: email.toLowerCase(),
      isAdmin: true,
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    if (password !== admin.password) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = generateToken(admin);

    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
