import express from "express";
import { Book } from "../models/Book";
import { BorrowRecord } from "../models/BorrowRecord";
import { Reservation } from "../models/Reservation";
import { checkBorrowLimit } from "../middleware/checkBorrowLimit";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Borrow a book
router.post(
  "/:id/borrow",
  authenticateToken,
  checkBorrowLimit,
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.quantity <= 0) {
        return res.status(400).json({ message: "Book is not available" });
      }

      // Create borrow record
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrowing period

      const borrowRecord = await BorrowRecord.create({
        user: req.user._id,
        book: book._id,
        dueDate,
      });

      // Decrement book quantity
      book.quantity -= 1;
      await book.save();

      // Check and update any reservations
      const activeReservation = await Reservation.findOne({
        book: book._id,
        status: "active",
      });

      if (activeReservation) {
        activeReservation.status = "fulfilled";
        await activeReservation.save();
      }

      res.status(201).json(borrowRecord);
    } catch (error) {
      console.error("Error borrowing book:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Return a book
router.post("/:id/return", authenticateToken, async (req, res) => {
  try {
    const borrowRecord = await BorrowRecord.findOne({
      user: req.user._id,
      book: req.params.id,
      status: "active",
    });

    if (!borrowRecord) {
      return res.status(404).json({ message: "No active borrow record found" });
    }

    // Update borrow record
    borrowRecord.status = "returned";
    borrowRecord.returnedAt = new Date();
    await borrowRecord.save();

    // Increment book quantity
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.quantity += 1;
    await book.save();

    res.json(borrowRecord);
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's borrowed books
router.get("/me/borrowed", authenticateToken, async (req, res) => {
  try {
    const borrowRecords = await BorrowRecord.find({
      user: req.user._id,
      status: "active",
    }).populate("book");

    res.json(borrowRecords);
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
