const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
