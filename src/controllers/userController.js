// src/controllers/userController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        userId: "USR" + Date.now().toString().slice(-4),
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Error during registration",
      });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt for:", email); // Debug log

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            userId: user.userId,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Error during login",
      });
    }
  },

  // Send borrow request
  sendBorrowRequest: async (req, res) => {
    try {
      const { bookId, duration } = req.body;
      const userId = req.user.id;

      // Validate duration
      const allowedDurations = [7, 15, 20, 30, 45];
      if (!allowedDurations.includes(duration)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid duration. Allowed durations: 7, 15, 20, 30, 45 days",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Add borrow request
      user.borrowHistory.push({
        book: bookId,
        borrowDate: new Date(),
        status: "pending",
      });

      await user.save();

      res.json({
        success: true,
        message: "Borrow request sent successfully",
        data: {
          bookId,
          duration,
          status: "pending",
        },
      });
    } catch (error) {
      console.error("Borrow request error:", error);
      res.status(500).json({
        success: false,
        message: "Error sending borrow request",
      });
    }
  },
};

module.exports = userController;
