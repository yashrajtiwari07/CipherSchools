/**
 * Authentication Service
 * Purpose: Business logic for user authentication
 * Used by: authController.js
 * Pattern: Service layer separates business logic from HTTP handling
 */

const User = require('../models/User');
const { generateToken } = require('../config/jwt');

class AuthService {
  /**
   * Register New User
   * Purpose: Creates new user account with validation
   * @param {Object} userData - { username, email, password }
   * @returns {Object} { token, user }
   * @throws {Error} If email/username already exists
   */
  async registerUser(userData) {
    try {
      const { username, email, password } = userData;

      // Check if user already exists
      // Purpose: Prevent duplicate accounts
      const existingUser = await User.findOne({
        $or: [{ email }, { username }] // Check both email AND username
      });

      if (existingUser) {
        throw new Error(
          existingUser.email === email 
            ? 'Email already registered' 
            : 'Username already taken'
        );
      }

      // Create new user in database
      // Note: Password will be hashed automatically by User model
      const user = await User.create({
        username,
        email,
        password
      });

      // Generate JWT token for authentication
      const token = generateToken({ userId: user._id });

      return {
        token, // JWT token
        user: user.getPublicProfile() // User data without password
      };

    } catch (error) {
      throw error; // Re-throw for controller to handle
    }
  }

  /**
   * Login User
   * Purpose: Authenticates user and returns token
   * @param {Object} credentials - { email, password }
   * @returns {Object} { token, user }
   * @throws {Error} If credentials invalid or account deactivated
   */
  async loginUser(credentials) {
    try {
      const { email, password } = credentials;

      // Find user and include password field
      // Note: Password is excluded by default (select: false)
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if account is active
      // Purpose: Prevent deactivated users from logging in
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Validate password using bcrypt comparison
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token for authenticated session
      const token = generateToken({ userId: user._id });

      return {
        token, // JWT token
        user: user.getPublicProfile() // User data without password
      };

    } catch (error) {
      throw error; // Re-throw for controller to handle
    }
  }

  /**
   * Get User By ID
   * Purpose: Retrieves user profile by ID
   * @param {String} userId - MongoDB ObjectId
   * @returns {Object} User profile (without password)
   * @throws {Error} If user not found
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user.getPublicProfile(); // Return user without password

    } catch (error) {
      throw error; // Re-throw for controller to handle
    }
  }
}

// Export singleton instance
// Purpose: Single shared instance across application
module.exports = new AuthService();
