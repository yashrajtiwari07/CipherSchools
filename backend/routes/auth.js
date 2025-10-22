/**
 * Authentication Routes
 * Purpose: Defines authentication endpoints
 * Base URL: /api/auth
 * Used by: server.js
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const {
  register,
  login,
  getProfile,
  logout
} = require('../controllers/authController');

/**
 * Register New User
 * @route   POST /api/auth/register
 * @desc    Creates new user account
 * @access  Public
 * @middleware validate(registerSchema) - Validates username, email, password
 */
router.post('/register', validate(registerSchema), register);

/**
 * Login User
 * @route   POST /api/auth/login
 * @desc    Authenticates user and returns JWT token
 * @access  Public
 * @middleware validate(loginSchema) - Validates email, password
 */
router.post('/login', validate(loginSchema), login);

/**
 * Get User Profile
 * @route   GET /api/auth/profile
 * @desc    Returns current user's profile
 * @access  Private (requires JWT token)
 * @middleware authenticateToken - Verifies JWT and attaches user to req
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * Logout User
 * @route   POST /api/auth/logout
 * @desc    Logs out user (client-side token removal)
 * @access  Private (requires JWT token)
 * @middleware authenticateToken - Verifies JWT
 */
router.post('/logout', authenticateToken, logout);

// Export router
module.exports = router;
