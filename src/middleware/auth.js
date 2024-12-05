// src/middleware/auth.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin with token
    const admin = await Admin.findOne({ _id: decoded.id });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Add admin and token to request
    req.admin = admin;
    req.token = token;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Please authenticate",
    });
  }
};
