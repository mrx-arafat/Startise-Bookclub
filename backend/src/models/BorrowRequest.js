const mongoose = require("mongoose");
const { Schema } = mongoose;

const BorrowRequestSchema = new Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    durationInDays: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }, 
    approvedAt: { type: Date, default: null },
    expectedReturnDate: { type: Date },
    returnedDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'returned'],
      default: 'requested',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BorrowRequest', BorrowRequestSchema);
