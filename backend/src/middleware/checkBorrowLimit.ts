import { Request, Response, NextFunction } from "express";
import { BorrowRecord } from "../models/BorrowRecord";

export const checkBorrowLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const activeBorrows = await BorrowRecord.countDocuments({
      user: userId,
      status: "active",
    });

    if (activeBorrows >= 1) {
      return res.status(403).json({
        message: "You have reached the maximum number of borrowed books (1)",
      });
    }

    next();
  } catch (error) {
    console.error("Error checking borrow limit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
