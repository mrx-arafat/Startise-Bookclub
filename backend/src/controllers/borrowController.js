const express = require("express");
const router = express.Router();
const BorrowRequest = require("../models/BorrowRequest");
const Book = require("../models/Book");
const { validateUser, validateAdmin } = require("../utils/jwt");

// Create a borrow request (Authenticated users)
router.post("/", validateUser, async (req, res) => {
  try {
    const { bookId, durationInDays } = req.body;
    const userId = req.user.id;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (!book.isAvailable || book.quantity < 1) {
      return res
        .status(400)
        .json({ message: "Book is not available for borrowing" });
    }

    // Check if user already has a pending or approved request for this book
    const existingRequest = await BorrowRequest.findOne({
      bookId,
      userId,
      status: { $in: ["requested", "approved"] },
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You already have an active request for this book" });
    }

    // Create borrow request
    const borrowRequest = new BorrowRequest({
      bookId,
      userId,
      durationInDays,
      status: "requested",
    });

    await borrowRequest.save();

    res.status(201).json({
      message: "Borrow request created successfully",
      borrowRequest,
    });
  } catch (error) {
    console.error("Create borrow request error:", error);
    res
      .status(500)
      .json({ message: "Error creating borrow request", error: error.message });
  }
});

// Get all borrow requests (Admin only)
router.get("/", validateUser, validateAdmin, async (req, res) => {
  try {
    const requests = await BorrowRequest.find()
      .populate("bookId")
      .populate("userId", "-password")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get borrow requests error:", error);
    res.status(500).json({
      message: "Error fetching borrow requests",
      error: error.message,
    });
  }
});

// Get user's borrow requests (Authenticated user)
router.get("/me", validateUser, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ userId: req.user.id })
      .populate("bookId")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get user borrow requests error:", error);
    res.status(500).json({
      message: "Error fetching your borrow requests",
      error: error.message,
    });
  }
});

// Update borrow request status (Admin only)
router.put("/:id", validateUser, validateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    // Validate status
    if (!["approved", "rejected", "returned"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const borrowRequest = await BorrowRequest.findById(requestId);
    if (!borrowRequest) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    // Update book availability based on status
    const book = await Book.findById(borrowRequest.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (status === "approved") {
      // Count the number of approved requests for this book
      const approvedRequestsCount = await BorrowRequest.countDocuments({
        bookId: borrowRequest.bookId,
        status: "approved",
        returnedDate: null,
      });

      if (approvedRequestsCount >= book.quantity) {
        return res.status(400).json({ message: "Book is not available" });
      }

      borrowRequest.approvedAt = new Date();
      borrowRequest.expectedReturnDate = new Date(
        Date.now() + borrowRequest.durationInDays * 24 * 60 * 60 * 1000
      );
    } else if (status === "returned") {
      borrowRequest.returnedDate = new Date();
    }

    borrowRequest.status = status;
    await borrowRequest.save();

    res.status(200).json({
      message: "Borrow request updated successfully",
      borrowRequest,
    });
  } catch (error) {
    console.error("Update borrow request error:", error);
    res.status(500).json({ 
      message: "Error updating borrow request", 
      error: error.message 
    });
  }
});

router.delete("/:id", validateUser, async (req, res) => {
  try {
    const requestId = req.params.id;

    const borrowRequest = await BorrowRequest.findById(requestId);
    if (!borrowRequest) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    if (
      borrowRequest.status === "returned" ||
      borrowRequest.status === "approved"
    ) {
      return res
        .status(400)
        .json({ message: "Cannot delete an approved or returned request" });
    }

    await BorrowRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Borrow request deleted successfully" });
  } catch (error) {
    console.error("Delete borrow request error:", error);
    res
      .status(500)
      .json({ message: "Error deleting borrow request", error: error.message });
  }
});

module.exports = router;
