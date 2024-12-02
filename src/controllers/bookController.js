const Book = require("../models/Book");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: error.message,
    });
  }
};

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error adding book",
      error: error.message,
    });
  }
};

// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { borrower, expectedReturnDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Book is not available for borrowing",
      });
    }

    book.status = "borrowed";
    book.currentBorrower = {
      name: borrower.name,
      email: borrower.email,
      borrowDate: new Date(),
      expectedReturnDate: expectedReturnDate,
    };

    book.borrowHistory.push({
      borrower,
      borrowDate: new Date(),
      expectedReturnDate,
    });

    await book.save();

    res.json({
      success: true,
      message: "Book borrowed successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error borrowing book",
      error: error.message,
    });
  }
};
