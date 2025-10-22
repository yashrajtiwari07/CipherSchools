/**
 * CORS Configuration
 * Purpose: Controls which domains can access the API
 * Used by: server.js
 * Security: Prevents unauthorized cross-origin requests
 */

const corsOptions = {
  /**
   * Origin Validation
   * Purpose: Checks if requesting domain is allowed
   * @param {String} origin - Requesting domain
   * @param {Function} callback - CORS callback
   */
  origin: function (origin, callback) {
    // Allow requests with no origin
    // Purpose: Mobile apps, Postman, curl don't send origin header
    if (!origin) return callback(null, true);
    
    // List of allowed domains
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000', // From environment variable
      'http://localhost:3000', // Local development
      'http://127.0.0.1:3000'  // Alternative localhost
    ];
    
    // Add production domains in production environment
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.push('https://yourdomain.com'); // Replace with actual domain
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS policy')); // Block request
    }
  },
  
  // Allow cookies and authentication headers
  credentials: true,
  
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // Allowed request headers
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // Success status for OPTIONS preflight requests
  optionsSuccessStatus: 200 // Legacy browser compatibility (IE11, SmartTVs)
};

// Export CORS configuration
module.exports = corsOptions;
