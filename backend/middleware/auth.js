/**
 * Authentication Middleware
 * Purpose: Verifies JWT tokens and protects routes
 * Used by: All protected routes in routes/*.js
 * Flow: Extract token → Verify → Get user → Attach to req.user → Continue
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authenticate Token Middleware
 * Purpose: Verifies JWT token and attaches user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @headers Authorization: Bearer <token>
 * @sets req.user - User object (without password)
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Get token after "Bearer "

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing'
      });
    }

    // Verify token using JWT_SECRET
    // Purpose: Decode token and verify signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database using userId from token
    // Purpose: Ensure user still exists and is active
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // Check if user account is active
    // Purpose: Prevent deactivated users from accessing protected routes
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Attach user to request object
    // Purpose: Make user data available to route handlers
    req.user = user;
    
    // Continue to next middleware/route handler
    next();
    
  } catch (error) {
    // Handle JWT verification errors
    
    // Invalid token format or signature
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    // Token has expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    // Other errors
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Export middleware
// Purpose: Make authenticateToken available to route files
module.exports = {
  authenticateToken // Used to protect routes: router.get('/profile', authenticateToken, handler)
};
