// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes (require authentication)
router.post("/borrow-request", auth, userController.sendBorrowRequest);

module.exports = router;
