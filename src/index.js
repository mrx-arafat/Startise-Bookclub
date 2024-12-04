const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");

// MongoDB Connection
console.log("Attempting to connect to MongoDB...");
console.log("Port configured:", process.env.PORT); // Debug log

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("📚 Connected to MongoDB Database");
    startServer();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to Startise Bookclub Management System");
});

// Test route to check if books are being fetched
app.get("/test-books", async (req, res) => {
  try {
    const Book = require("./models/Book");
    const books = await Book.find();
    res.json({ count: books.length, books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function startServer() {
  // Force the port to be 5000
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
