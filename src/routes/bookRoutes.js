const express = require("express");
const router = express.Router();
const { getAllBooks, addBook } = require("../controllers/bookController");

// Define routes
router.get("/", getAllBooks); // Fix: Add the controller function
router.post("/", addBook); // Fix: Add the controller function

module.exports = router;
