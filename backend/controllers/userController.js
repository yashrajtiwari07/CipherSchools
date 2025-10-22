/**
 * User Controller
 * Purpose: Handles user profile management
 * Routes: /api/users/*
 * Used by: routes/users.js
 */

const User = require('../models/User');
const Project = require('../models/Project');

/**
 * Update User Profile
 * @desc    Updates user profile information
 * @route   PUT /api/users/profile
 * @access  Private
 * @body    { username, email, preferences }
 * @returns { success, message, user }
 */
const updateProfile = async (req, res) => {
  try {
    const { username, email, preferences } = req.body;
    const userId = req.user._id;

    // Check if username/email already exists
    // Purpose: Prevent duplicate usernames/emails (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId }, // Exclude current user
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.username === username 
            ? 'Username already taken' 
            : 'Email already registered'
        });
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(username && { username }), // Only update if provided
        ...(email && { email }),
        ...(preferences && { preferences })
      },
      { new: true, runValidators: true } // Return updated doc and validate
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * Change Password
 * @desc    Changes user password
 * @route   PUT /api/users/password
 * @access  Private
 * @body    { currentPassword, newPassword }
 * @returns { success, message }
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password field
    // Purpose: Password is excluded by default, need to explicitly include it
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    // Purpose: Ensure user knows current password before changing
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    // Note: Password will be hashed automatically by User model pre-save hook
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

/**
 * Delete Account
 * @desc    Deletes user account and all associated data
 * @route   DELETE /api/users/account
 * @access  Private
 * @body    { password }
 * @returns { success, message }
 */
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    // Get user with password field
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    // Purpose: Require password confirmation for account deletion (security)
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Delete user's projects first
    // Purpose: Clean up all user data before deleting account
    await Project.deleteMany({ userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
};

// Export user management functions
module.exports = {
  updateProfile, // PUT /api/users/profile
  changePassword, // PUT /api/users/password
  deleteAccount // DELETE /api/users/account
};
