const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { protect } = require("../controllers/authController");

// Public routes
router.get("/", bookController.getAllBooks);

// Protected routes (admin only)
router.use(protect);
router.post("/", bookController.addBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;
