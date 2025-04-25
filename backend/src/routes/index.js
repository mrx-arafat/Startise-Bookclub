const express = require("express");
const router = express.Router();
const authRoutes = require("../controllers/authController");
const userRoutes = require("../controllers/userController");
const bookRoutes = require("../controllers/bookController");
const borrowRoutes = require("../controllers/borrowController");
const suggestionRoutes = require("../controllers/suggestionController");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/borrow-requests", borrowRoutes);
router.use("/book-suggestions", suggestionRoutes);

module.exports = router;
