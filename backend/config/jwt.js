/**
 * JWT Configuration
 * Purpose: JWT token generation, verification, and decoding utilities
 * Used by: authController.js, middleware/auth.js
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * Purpose: Creates a signed JWT token with user payload
 * @param {Object} payload - Data to encode in token (e.g., { userId: '123' })
 * @returns {String} Signed JWT token
 * Used by: authController.js (register, login)
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload, // Data to encode (userId, etc.)
    process.env.JWT_SECRET, // Secret key for signing
    {
      expiresIn: process.env.JWT_EXPIRE || '7d', // Token expires in 7 days by default
    }
  );
};

/**
 * Verify JWT Token
 * Purpose: Verifies token signature and expiration
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload if valid
 * @throws {Error} If token is invalid or expired
 * Used by: middleware/auth.js
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verify and decode
  } catch (error) {
    throw new Error('Invalid token'); // Token invalid or expired
  }
};

/**
 * Decode JWT Token (without verification)
 * Purpose: Decodes token without verifying signature
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded payload (unverified)
 * Note: Use verifyToken() for secure verification
 */
const decodeToken = (token) => {
  return jwt.decode(token); // Decode without verification
};

// Export JWT utilities
module.exports = {
  generateToken, // Create new JWT token
  verifyToken,   // Verify and decode token
  decodeToken,   // Decode without verification
};
