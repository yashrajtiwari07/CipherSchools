/**
 * CipherStudio Backend Server
 * Purpose: Main entry point for the Express API server
 * Handles: Authentication, Projects, Files, User management
 */

// Import Dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config(); // Load environment variables from .env file

// Validate Required Environment Variables
// Purpose: Ensure critical environment variables are set before starting server
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1); // Exit if JWT_SECRET is missing
}

if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL ERROR: MONGODB_URI is not defined in environment variables');
  process.exit(1); // Exit if MongoDB URI is missing
}

// Import Configuration & Middleware
const connectDB = require('./config/database'); // MongoDB connection
const corsConfig = require('./middleware/cors'); // CORS configuration
const errorHandler = require('./middleware/errorHandler'); // Error handler

// Import Routes
const authRoutes = require('./routes/auth'); // Authentication routes
const userRoutes = require('./routes/users'); // User routes
const projectRoutes = require('./routes/projects'); // Project routes
const fileRoutes = require('./routes/files'); // File routes

// Initialize Express App
const app = express();

// Connect to MongoDB Database
// Purpose: Establish connection to MongoDB before starting server
connectDB();

// Security Middleware
// Purpose: Protects the API from common web vulnerabilities
app.use(helmet()); // Adds security headers to HTTP responses
app.use(cors(corsConfig)); // Allows frontend to make requests to backend

// Rate Limiting
// Purpose: Prevents spam and DDoS attacks by limiting requests per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Maximum 100 requests per IP in 15 minutes
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter); // Apply rate limiting to all /api/* routes

// Body Parsing Middleware
// Purpose: Parses incoming request bodies (JSON and URL-encoded data)
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies up to 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Logging
// Purpose: Logs HTTP requests to console (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logs: GET /api/projects 200 123ms
}

// Health Check Route
// Purpose: Check if the API server is running (used for monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CipherStudio API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
// Purpose: Connect route handlers to their respective endpoints
app.use('/api/auth', authRoutes); // Authentication: /api/auth/login, /register
app.use('/api/users', userRoutes); // User management: /api/users/profile
app.use('/api/projects', projectRoutes); // Projects: /api/projects (CRUD)
app.use('/api/files', fileRoutes); // Files: /api/files (CRUD)

// 404 Handler
// Purpose: Catch all undefined routes and return 404 error
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error Handler Middleware
// Purpose: Catches all errors and sends formatted error response
app.use(errorHandler); // Global error handler

// Start Server
// Purpose: Listen for incoming HTTP requests on specified port
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

app.listen(PORT, () => {
  console.log(`🚀 CipherStudio API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
});

// Export App
// Purpose: Export app for testing purposes
module.exports = app;
