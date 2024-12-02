const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["available", "borrowed", "maintenance"],
      default: "available",
    },
    category: {
      type: String,
      trim: true,
    },
    borrowHistory: [
      {
        borrower: {
          name: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
        },
        borrowDate: {
          type: Date,
          required: true,
        },
        returnDate: Date,
        expectedReturnDate: Date,
      },
    ],
    currentBorrower: {
      name: String,
      email: String,
      borrowDate: Date,
      expectedReturnDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
