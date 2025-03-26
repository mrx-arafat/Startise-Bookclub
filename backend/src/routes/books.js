const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const auth = require("../middleware/auth");

// Public routes
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Protected routes (require authentication)
router.post("/", auth, createBook);
router.put("/:id", auth, updateBook);
router.delete("/:id", auth, deleteBook);

module.exports = router;
