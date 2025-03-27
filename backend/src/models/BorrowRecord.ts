import mongoose, { Schema, Document } from "mongoose";

export interface IBorrowRecord extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  borrowedAt: Date;
  returnedAt?: Date;
  dueDate: Date;
  status: "active" | "returned" | "overdue";
}

const borrowRecordSchema = new Schema<IBorrowRecord>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowedAt: {
      type: Date,
      default: Date.now,
    },
    returnedAt: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "returned", "overdue"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
borrowRecordSchema.index({ user: 1, status: 1 });
borrowRecordSchema.index({ book: 1, status: 1 });
borrowRecordSchema.index({ dueDate: 1 });

export const BorrowRecord = mongoose.model<IBorrowRecord>(
  "BorrowRecord",
  borrowRecordSchema
);
