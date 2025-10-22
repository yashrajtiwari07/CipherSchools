/**
 * User Routes
 * Purpose: Defines user management endpoints
 * Base URL: /api/users
 * Used by: server.js
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  updateProfile,
  changePassword,
  deleteAccount
} = require('../controllers/userController');

/**
 * Update User Profile
 * @route   PUT /api/users/profile
 * @desc    Updates user profile (username, email, preferences)
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * Change Password
 * @route   PUT /api/users/password
 * @desc    Changes user password
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.put('/password', authenticateToken, changePassword);

/**
 * Delete Account
 * @route   DELETE /api/users/account
 * @desc    Deletes user account and all associated data
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.delete('/account', authenticateToken, deleteAccount);

// Export router
module.exports = router;
