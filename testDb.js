const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    // Try to list databases
    const admin = mongoose.connection.db.admin();
    const dbInfo = await admin.listDatabases();
    console.log("Databases:", dbInfo);
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
    process.exit(0);
  }
}

testConnection();
