import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  reservedAt: Date;
  expiresAt: Date;
  status: "active" | "fulfilled" | "expired" | "cancelled";
}

const reservationSchema = new Schema<IReservation>(
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
    reservedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "fulfilled", "expired", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
reservationSchema.index({ user: 1, status: 1 });
reservationSchema.index({ book: 1, status: 1 });
reservationSchema.index({ expiresAt: 1 });

export const Reservation = mongoose.model<IReservation>(
  "Reservation",
  reservationSchema
);
