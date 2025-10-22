/**
 * Custom Error Response Class
 * Provides consistent error handling across the application
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error response creators
 */
const errorResponses = {
  // 400 Bad Request
  badRequest: (message = 'Bad request') => {
    return new ErrorResponse(message, 400);
  },

  // 401 Unauthorized
  unauthorized: (message = 'Unauthorized access') => {
    return new ErrorResponse(message, 401);
  },

  // 403 Forbidden
  forbidden: (message = 'Access forbidden') => {
    return new ErrorResponse(message, 403);
  },

  // 404 Not Found
  notFound: (resource = 'Resource') => {
    return new ErrorResponse(`${resource} not found`, 404);
  },

  // 409 Conflict
  conflict: (message = 'Resource conflict') => {
    return new ErrorResponse(message, 409);
  },

  // 422 Unprocessable Entity
  validationError: (message = 'Validation failed') => {
    return new ErrorResponse(message, 422);
  },

  // 500 Internal Server Error
  serverError: (message = 'Internal server error') => {
    return new ErrorResponse(message, 500);
  }
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 */
const sendErrorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      error: error.toString()
    })
  });
};

module.exports = {
  ErrorResponse,
  errorResponses,
  sendErrorResponse
};
