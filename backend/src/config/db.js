const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debug: Log environment variables
    console.log('🔍 [DB Connection Debug]');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ NOT SET'}`);
    if (process.env.MONGODB_URI) {
      // Show masked URI for security
      const maskedUri = process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@');
      console.log(`   MONGODB_URI Value: ${maskedUri}`);
    }
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   PORT: ${process.env.PORT || '5000'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET'}`);
    console.log(`   Current Working Directory: ${process.cwd()}`);

    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined. Please check your .env file.');
    }

    console.log(`📡 Attempting to connect to MongoDB...`);
    console.log(`   URI: ${process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@')}`); // Hide credentials

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

  } catch (error) {
    console.error('❌ [DB Connection Error]');
    console.error(`   Error Type: ${error.name}`);
    console.error(`   Error Message: ${error.message}`);
    console.error(`   Error Code: ${error.code || 'N/A'}`);

    // Detailed error logging based on error type
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   💡 Hint: MongoDB server is not running or not accessible at the specified address');
      console.error(`   💡 Check if MongoDB is running: sudo systemctl status mongod`);
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('   💡 Hint: Cannot resolve MongoDB hostname. Check your MONGODB_URI');
    } else if (error.message.includes('authentication failed')) {
      console.error('   💡 Hint: MongoDB authentication failed. Check username/password in MONGODB_URI');
    } else if (error.message.includes('MONGODB_URI')) {
      console.error('   💡 Hint: MONGODB_URI is not set. Make sure your .env file is loaded');
    }

    console.error(`\n   Full Error Stack:`);
    console.error(error.stack);

    process.exit(1);
  }
};

module.exports = connectDB;
