require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Book = require("./src/models/Book");

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Seed Users
    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@bookclub.com",
        password: "admin123", // Plain text password (matches your auth setup)
        isAdmin: true,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "john123",
        isAdmin: false,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "jane123",
        isAdmin: false,
      },
      {
        name: "Bob Wilson",
        email: "bob@example.com",
        password: "bob123",
        isAdmin: false,
      },
    ]);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed Books
    const books = await Book.insertMany([
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        quantity: 5,
        isAvailable: true,
        coverImage:
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Fiction",
        quantity: 3,
        isAvailable: true,
        coverImage:
          "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&auto=format&fit=crop&q=60",
      },
      {
        title: "1984",
        author: "George Orwell",
        category: "Dystopian",
        quantity: 4,
        isAvailable: true,
        coverImage:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60",
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Romance",
        quantity: 2,
        isAvailable: true,
        coverImage:
          "https://images.unsplash.com/photo-1495446815901-a7297e3ffe02?w=500&auto=format&fit=crop&q=60",
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        category: "Fiction",
        quantity: 3,
        isAvailable: true,
        coverImage:
          "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&auto=format&fit=crop&q=60",
      },
    ]);
    console.log(`✅ Seeded ${books.length} books`);

    console.log("\n📊 Seed Data Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n👥 Users:");
    users.forEach((user) => {
      console.log(`  • ${user.name} (${user.email}) - ${user.isAdmin ? "Admin" : "User"}`);
      console.log(`    Password: ${user.password}`);
    });
    console.log("\n📚 Books:");
    books.forEach((book) => {
      console.log(`  • ${book.title} by ${book.author} (Qty: ${book.quantity})`);
    });
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

