const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Admin = require("../src/models/Admin");

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    const adminData = {
      username: "arafat",
      password: "Arafat@123456",
      email: "arafat@wpdeveloper.com",
      role: "admin",
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminData.username });
    if (existingAdmin) {
      console.log("Admin user already exists!");
    } else {
      // Create new admin
      const admin = new Admin(adminData);
      await admin.save();
      console.log("Admin created successfully:", {
        username: admin.username,
        email: admin.email,
        role: admin.role,
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

createAdmin();
