// src/controllers/bookController.js
const Book = require("../models/Book");

// Create new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, category } = req.body;

    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    const book = new Book({
      title,
      author,
      isbn,
      category,
    });

    await book.save();

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating book",
    });
  }
};

// Get all books with filters
exports.getBooks = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const query = {};

    // Apply filters
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
        { isbn: new RegExp(search, "i") },
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;

    const books = await Book.find(query)
      .populate("currentBorrower.userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching books",
    });
  }
};

// Get single book
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("currentBorrower.userId", "name email")
      .populate("borrowHistory.userId", "name email");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching book",
    });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, category, status } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (status) book.status = status;

    await book.save();

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating book",
    });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.status === "borrowed") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete borrowed book",
      });
    }

    await book.remove();

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting book",
    });
  }
};
