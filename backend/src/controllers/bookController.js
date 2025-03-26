const Book = require("../models/Book");
const mongoose = require("mongoose");

// Get all books (Public)
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error("Get books error:", error);
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
};

// Get a book by ID (Public)
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Get book error:", error);
    res
      .status(500)
      .json({ message: "Error fetching book", error: error.message });
  }
};

// Create a new book (Admin only)
const createBook = async (req, res) => {
  try {
    const { title, author, category, quantity, coverImage, description } =
      req.body;

    const book = new Book({
      title,
      author,
      category,
      quantity,
      coverImage,
      description,
      isAvailable: true,
      status: "available",
    });

    await book.save();
    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Create book error:", error);
    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
};

// Update a book (Admin only)
const updateBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      quantity,
      coverImage,
      description,
      isAvailable,
      status,
    } = req.body;
    const bookId = req.params.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update book fields
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.quantity = quantity || book.quantity;
    book.coverImage = coverImage || book.coverImage;
    book.description = description || book.description;
    book.isAvailable =
      isAvailable !== undefined ? isAvailable : book.isAvailable;
    book.status = status || book.status;

    await book.save();

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};

// Delete a book (Admin only)
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
