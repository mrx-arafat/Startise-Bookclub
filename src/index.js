const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Import routes
const bookRoutes = require("./routes/bookRoutes"); // Add this line

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/books", bookRoutes); // Add this line

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("📚 Connected to Startise Bookclub Database"))
  .catch((err) => console.error("Database connection error:", err));

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to Startise Bookclub Management System");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Startise Bookclub Server running on port ${PORT}`);
});
