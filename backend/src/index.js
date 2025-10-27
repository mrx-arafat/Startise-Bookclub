const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Debug: Log .env file loading
console.log("\n" + "=".repeat(60));
console.log("📦 [Environment Configuration Loading]");
console.log("=".repeat(60));

// Check which .env file will be loaded
const envPath = path.resolve(process.cwd(), ".env");
const envExamplePath = path.resolve(process.cwd(), ".env.example");

console.log(`📁 Current Working Directory: ${process.cwd()}`);
console.log(`🔍 Looking for .env at: ${envPath}`);

if (fs.existsSync(envPath)) {
  console.log(`✅ .env file found!`);
  const stats = fs.statSync(envPath);
  console.log(`   Size: ${stats.size} bytes`);
  console.log(`   Last Modified: ${stats.mtime.toISOString()}`);

  // Read and display .env content (without sensitive values)
  const envContent = fs.readFileSync(envPath, "utf8");
  const envLines = envContent.split("\n").filter(line => line.trim() && !line.startsWith("#"));
  console.log(`   Variables loaded: ${envLines.length}`);
  envLines.forEach(line => {
    const [key] = line.split("=");
    console.log(`     • ${key}`);
  });
} else {
  console.log(`❌ .env file NOT found at ${envPath}`);
  if (fs.existsSync(envExamplePath)) {
    console.log(`   💡 Found .env.example - copy it to .env`);
  }
}

console.log("=".repeat(60) + "\n");

// Load environment variables
require("dotenv").config();

const connectDB = require("./config/db");

// Import routes
const routes = require("./routes");
// Initialize express app
const app = express();

// Debug: Log startup information
console.log("\n" + "=".repeat(60));
console.log("🚀 [Backend Startup Debug Information]");
console.log("=".repeat(60));
console.log(`📅 Timestamp: ${new Date().toISOString()}`);
console.log(`🖥️  Node Version: ${process.version}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${process.env.PORT || 5000}`);
console.log("=".repeat(60) + "\n");

// Connect to MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
// Routes
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log("=".repeat(60) + "\n");
});



// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
