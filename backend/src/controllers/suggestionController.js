const express = require("express");
const router = express.Router();
const BookSuggestion = require("../models/BookSuggestion");
const { validateUser, validateAdmin } = require("../utils/jwt");

// Create a new book suggestion (Authenticated users)
router.post("/", validateUser, async (req, res) => {
  try {
    const { title, author, category, referenceUrl } = req.body;
    const userId = req.user.id;

    const suggestion = new BookSuggestion({
      userId,
      title,
      author,
      category,
      referenceUrl,
    });

    await suggestion.save();

    res.status(201).json({
      message: "Book suggestion created successfully",
      suggestion,
    });
  } catch (error) {
    console.error("Create suggestion error:", error);
    res.status(500).json({
      message: "Error creating suggestion",
      error: error.message,
    });
  }
});

// Get all suggestions (Admin only)
router.get("/", validateUser, validateAdmin, async (req, res) => {
  try {
    const suggestions = await BookSuggestion.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Get suggestions error:", error);
    res.status(500).json({
      message: "Error fetching suggestions",
      error: error.message,
    });
  }
});

// Get user's own suggestions (Authenticated user) (optional)
router.get("/me", validateUser, async (req, res) => {
  try {
    const suggestions = await BookSuggestion.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Get user suggestions error:", error);
    res.status(500).json({
      message: "Error fetching your suggestions",
      error: error.message,
    });
  }
});

// Update a suggestion (Owner only, Admin can change status)
router.put("/:id", validateUser, async (req, res) => {
  try {
    const { title, author, category, referenceUrl, status } = req.body;
    const suggestionId = req.params.id;
    const userId = req.user.id;

    const suggestion = await BookSuggestion.findOne({
      _id: suggestionId,
      userId: userId,
    });

    if (!suggestion) {
      return res.status(404).json({
        message:
          "Suggestion not found or you don't have permission to update it",
      });
    }

    // Update only provided fields
    if (title) suggestion.title = title;
    if (author) suggestion.author = author;
    if (category) suggestion.category = category;
    if (referenceUrl) suggestion.referenceUrl = referenceUrl;

    // Only admin can update the status
    if (status && req.user.isAdmin) {
      suggestion.status = status;
    }

    await suggestion.save();

    res.status(200).json({
      message: "Suggestion updated successfully",
      suggestion,
    });
  } catch (error) {
    console.error("Update suggestion error:", error);
    res.status(500).json({
      message: "Error updating suggestion",
      error: error.message,
    });
  }
});

// Delete a suggestion (Owner or Admin)
router.delete("/:id", validateUser, validateAdmin, async (req, res) => {
  try {
    const suggestionId = req.params.id;

    const suggestion = await BookSuggestion.findByIdAndDelete(suggestionId);

    if (!suggestion) {
      return res.status(404).json({
        message: "Suggestion not found",
      });
    }

    res.status(200).json({
      message: "Suggestion deleted successfully",
      suggestion,
    });
  } catch (error) {
    console.error("Delete suggestion error:", error);
    res.status(500).json({
      message: "Error deleting suggestion",
      error: error.message,
    });
  }
});

module.exports = router;
