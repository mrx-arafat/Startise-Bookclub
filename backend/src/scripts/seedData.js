const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");
require("dotenv").config();

const dummyBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    quantity: 5,
    coverImage: "https://example.com/gatsby.jpg",
    description: "A story of decadence and excess...",
    isAvailable: true,
    status: "available",
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Science Fiction",
    quantity: 3,
    coverImage: "https://example.com/1984.jpg",
    description: "A dystopian social science fiction novel...",
    isAvailable: true,
    status: "available",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    quantity: 4,
    coverImage: "https://example.com/mockingbird.jpg",
    description: "A story of racial injustice...",
    isAvailable: true,
    status: "available",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    quantity: 2,
    coverImage: "https://example.com/pride.jpg",
    description: "A romantic novel of manners...",
    isAvailable: true,
    status: "available",
  },
];

const dummyUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    isAdmin: false,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    // Insert dummy books
    const books = await Book.insertMany(dummyBooks);
    console.log("Inserted dummy books");

    // Insert dummy users
    const users = await User.insertMany(dummyUsers);
    console.log("Inserted dummy users");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
