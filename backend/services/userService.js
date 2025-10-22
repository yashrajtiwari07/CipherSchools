const User = require('../models/User');
const Project = require('../models/Project');

class UserService {
  // Update user profile
  async updateUserProfile(userId, updateData) {
    try {
      const { username, email, preferences } = updateData;

      // Check for conflicts with other users
      if (username || email) {
        const existingUser = await User.findOne({
          _id: { $ne: userId },
          $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : [])
          ]
        });

        if (existingUser) {
          throw new Error(
            existingUser.username === username 
              ? 'Username already taken' 
              : 'Email already registered'
          );
        }
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...(username && { username }),
          ...(email && { email }),
          ...(preferences && { preferences })
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser.getPublicProfile();

    } catch (error) {
      throw error;
    }
  }

  // Change user password
  async changeUserPassword(userId, passwordData) {
    try {
      const { currentPassword, newPassword } = passwordData;

      // Get user with password
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);

      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };

    } catch (error) {
      throw error;
    }
  }

  // Delete user account
  async deleteUserAccount(userId, password) {
    try {
      // Get user with password
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new Error('Password is incorrect');
      }

      // Delete user's projects first
      await Project.deleteMany({ userId });

      // Delete user account
      await User.findByIdAndDelete(userId);

      return { message: 'Account deleted successfully' };

    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    try {
      const projectCount = await Project.countDocuments({ userId });
      
      return {
        projectCount,
        joinedDate: (await User.findById(userId)).createdAt
      };

    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
