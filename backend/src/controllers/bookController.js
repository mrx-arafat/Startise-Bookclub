const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { validateUser, validateAdmin } = require("../utils/jwt");
const mongoose = require("mongoose");

// Create a new book (Admin only)
router.post("/", validateUser, validateAdmin, async (req, res) => {
  try {
    const { title, author, category, quantity, coverImage } = req.body;

    // Create new book
    const book = new Book({
      title,
      author,
      category,
      quantity,
      coverImage,
      isAvailable: true,
    });

    // Save book to database
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
});

// Get all books (Public)
router.get("/", async (req, res) => {
  try {
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "borrowrequests",
          localField: "_id",
          foreignField: "bookId",
          as: "borrowRequests",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "borrowRequests.userId",
          foreignField: "_id",
          as: "borrowUsers",
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          category: 1,
          quantity: 1,
          isAvailable: 1,
          coverImage: 1,
          borrowers: {
            $filter: {
              input: "$borrowRequests",
              as: "request",
              cond: {
                $and: [
                  { $eq: ["$$request.status", "approved"] },
                  { $eq: ["$$request.returnedDate", null] },
                ],
              },
            },
          },
        },
      },
    ]);

    res.status(200).json(books);
  } catch (error) {
    console.error("Get books error:", error);
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Get a book by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const books = await Book.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(bookId) }
      },
      {
        $lookup: {
          from: "borrowrequests",
          localField: "_id",
          foreignField: "bookId",
          as: "borrowRequests",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "borrowRequests.userId",
          foreignField: "_id",
          as: "borrowUsers",
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          category: 1,
          quantity: 1,
          isAvailable: 1,
          coverImage: 1,
          borrowers: {
            $filter: {
              input: "$borrowRequests",
              as: "request",
              cond: {
                $and: [
                  { $eq: ["$$request.status", "approved"] },
                  { $eq: ["$$request.returnedDate", null] },
                ],
              },
            },
          },
        },
      },
    ]);

    if (!books.length) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(books[0]);
  } catch (error) {
    console.error("Get book by ID error:", error);
    res
      .status(500)
      .json({ message: "Error fetching book by ID", error: error.message });
  }
});

// Update a book by ID (Admin only)
router.put("/:id", validateUser, validateAdmin, async (req, res) => {
  try {
    const { title, author, category, quantity, coverImage, isAvailable } =
      req.body;
    const bookId = req.params.id;

    // Create updates object with only the provided fields
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (author !== undefined) updates.author = author;
    if (category !== undefined) updates.category = category;
    if (quantity !== undefined) updates.quantity = quantity;
    if (coverImage !== undefined) updates.coverImage = coverImage;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;

    // Find and update the book
    const updatedBook = await Book.findByIdAndUpdate(bookId, updates, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Update book error:", error);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
});

// Delete a book by ID (Admin only)
router.delete("/:id", validateUser, validateAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
});

module.exports = router;
