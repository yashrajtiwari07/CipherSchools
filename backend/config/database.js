/**
 * MongoDB Database Configuration
 * Purpose: Establishes connection to MongoDB database
 * Used by: server.js (called on app startup)
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * Purpose: Establishes connection using Mongoose ODM
 * Returns: Promise (resolves when connected, rejects on error)
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // Use new URL parser
      useUnifiedTopology: true, // Use new connection management engine
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle Connection Events
    // Purpose: Monitor database connection status
    
    // On Error: Log connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // On Disconnect: Log when database disconnects
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful Shutdown
    // Purpose: Close database connection when app terminates (Ctrl+C)
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0); // Exit process cleanly
    });

  } catch (error) {
    // Connection Failed: Log error and exit
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // Exit with error code
  }
};

// Export Function
// Purpose: Make connectDB available to other files
module.exports = connectDB;
