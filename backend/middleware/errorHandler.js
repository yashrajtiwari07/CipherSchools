/**
 * Global Error Handler Middleware
 * Purpose: Catches all errors and sends formatted error responses
 * Used by: server.js (last middleware in chain)
 * Flow: Any error → This handler → Formatted JSON response
 */

/**
 * Error Handler
 * Purpose: Formats errors and sends appropriate HTTP responses
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware (unused)
 */
const errorHandler = (err, req, res, next) => {
  // Copy error object
  let error = { ...err };
  error.message = err.message;

  // Log error with request context
  // Purpose: Help debugging by showing what request caused the error
  console.error('Error occurred:', {
    message: err.message,
    method: req.method, // GET, POST, etc.
    path: req.path, // /api/projects, etc.
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Stack trace in dev only
  });

  // Mongoose Bad ObjectId Error
  // Purpose: Invalid MongoDB ID format (e.g., "abc" instead of "507f1f77bcf86cd799439011")
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID';
    error = { message, statusCode: 400 };
  }

  // Mongoose Duplicate Key Error
  // Purpose: Trying to create duplicate unique field (e.g., duplicate email)
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    // Extract field name from error for better message
    const field = Object.keys(err.keyValue)[0];
    if (field) {
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
    
    error = { message, statusCode: 400 };
  }

  // Mongoose Validation Error
  // Purpose: Model validation failed (e.g., required field missing)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT Invalid Token Error
  // Purpose: Token signature invalid or malformed
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token', statusCode: 401 };
  }

  // JWT Expired Token Error
  // Purpose: Token has passed expiration time
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired', statusCode: 401 };
  }

  // File Size Limit Error
  // Purpose: Uploaded file exceeds size limit
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = { message: 'File size too large', statusCode: 413 };
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace in development
  });
};

// Export error handler
module.exports = errorHandler;
