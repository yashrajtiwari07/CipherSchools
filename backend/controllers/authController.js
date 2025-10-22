/**
 * Authentication Controller
 * Purpose: Handles user authentication (register, login, profile, logout)
 * Routes: /api/auth/*
 * Used by: routes/auth.js
 */

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

/**
 * Register New User
 * @desc    Creates new user account
 * @route   POST /api/auth/register
 * @access  Public (no authentication required)
 * @body    { username, email, password }
 * @returns { success, message, token, user }
 */
const register = async (req, res) => {
  try {
    // Extract user data from request body
    const { username, email, password } = req.body;

    // Check if user already exists
    // Purpose: Prevent duplicate emails or usernames
    const existingUser = await User.findOne({
      $or: [{ email }, { username }] // Check both email AND username
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user in database
    // Purpose: Save user account (password will be hashed automatically by User model)
    const user = await User.create({
      username,
      email,
      password // Will be hashed by pre-save hook in User model
    });

    // Generate JWT token for authentication
    // Purpose: Allow user to access protected routes
    const token = generateToken({ userId: user._id });

    // Send success response with token and user data
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token, // JWT token for authentication
      user: user.getPublicProfile() // User data without password
    });

  } catch (error) {
    // Handle any errors during registration
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Login User
 * @desc    Authenticates user and returns JWT token
 * @route   POST /api/auth/login
 * @access  Public (no authentication required)
 * @body    { email, password }
 * @returns { success, message, token, user }
 */
const login = async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    // Find user by email and include password field
    // Purpose: Password is excluded by default (select: false), so we explicitly include it
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password' // Generic message for security
      });
    }

    // Check if user account is active
    // Purpose: Prevent deactivated users from logging in
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Validate password using bcrypt comparison
    // Purpose: Compare plain text password with hashed password in database
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password' // Generic message for security
      });
    }

    // Generate JWT token for authenticated session
    // Purpose: Token will be used for subsequent API requests
    const token = generateToken({ userId: user._id });

    // Send success response with token and user data
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // JWT token for authentication
      user: user.getPublicProfile() // User data without password
    });

  } catch (error) {
    // Handle any errors during login
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Get User Profile
 * @desc    Returns current user's profile data
 * @route   GET /api/auth/profile
 * @access  Private (requires authentication)
 * @headers Authorization: Bearer <token>
 * @returns { success, user }
 */
const getProfile = async (req, res) => {
  try {
    // Get user ID from JWT token (set by auth middleware)
    // Purpose: req.user is populated by auth middleware after verifying JWT
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send user profile data
    res.status(200).json({
      success: true,
      user: user.getPublicProfile() // User data without password
    });

  } catch (error) {
    // Handle any errors
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

/**
 * Logout User
 * @desc    Logs out user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private (requires authentication)
 * @note    JWT logout is handled on client side by removing token
 * @returns { success, message }
 */
const logout = async (req, res) => {
  try {
    // For JWT, logout is handled on client side
    // Purpose: Client removes token from localStorage
    // This endpoint exists for logging/tracking purposes
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    // Handle any errors
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

// Export all authentication functions
// Purpose: Make functions available to routes/auth.js
module.exports = {
  register,  // POST /api/auth/register
  login,     // POST /api/auth/login
  getProfile, // GET /api/auth/profile
  logout     // POST /api/auth/logout
};
