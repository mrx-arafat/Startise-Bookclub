// src/models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "borrowed", "maintenance"],
      default: "available",
    },
    currentBorrower: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      borrowDate: Date,
      expectedReturnDate: Date,
    },
    borrowHistory: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        borrowDate: Date,
        returnDate: Date,
      },
    ],
    borrowCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
