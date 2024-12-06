const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookSuggestionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: false },
    referenceUrl: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookSuggestion", BookSuggestionSchema);
