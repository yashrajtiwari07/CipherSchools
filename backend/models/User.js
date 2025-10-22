/**
 * User Model
 * Purpose: Defines schema for user accounts and authentication
 * Used by: authController.js, userController.js
 * Database: MongoDB collection 'users'
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// User Schema Definition
// Purpose: Stores user account data, preferences, and authentication info
const userSchema = new mongoose.Schema({
  // Username
  // Purpose: Unique identifier for user (used for login and display)
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, // No duplicate usernames allowed
    trim: true, // Remove whitespace
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  // Email Address
  // Purpose: User's email (used for login and notifications)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // No duplicate emails allowed
    lowercase: true, // Convert to lowercase
    trim: true, // Remove whitespace
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // Password (Hashed)
  // Purpose: Stores hashed password for authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default (security)
  },
  // Avatar URL
  // Purpose: Profile picture URL (optional)
  avatar: {
    type: String,
    default: null // No avatar by default
  },
  
  // User Preferences
  // Purpose: Stores IDE settings and preferences
  preferences: {
    // Editor Theme
    theme: {
      type: String,
      enum: ['light', 'dark'], // Only light or dark allowed
      default: 'light'
    },
    // Editor Font Size
    fontSize: {
      type: Number,
      default: 14, // Default 14px
      min: 10, // Minimum 10px
      max: 24  // Maximum 24px
    },
    // Auto-Save Feature
    autoSave: {
      type: Boolean,
      default: true // Auto-save enabled by default
    }
  },
  
  // Account Status
  // Purpose: Enable/disable user account
  isActive: {
    type: Boolean,
    default: true // Active by default
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    // Transform function runs when converting to JSON
    // Purpose: Remove password from JSON responses (security)
    transform: function(doc, ret) {
      delete ret.password; // Never send password in API responses
      return ret;
    }
  }
});

// Database Indexes
// Purpose: Speed up queries by email and username
userSchema.index({ email: 1 }); // Index for email lookups (login)
userSchema.index({ username: 1 }); // Index for username lookups

// Pre-Save Hook: Password Hashing
// Purpose: Automatically hash password before saving to database
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12); // Generate salt (12 rounds = very secure)
    this.password = await bcrypt.hash(this.password, salt); // Hash password with salt
    next(); // Continue with save
  } catch (error) {
    next(error); // Pass error to next middleware
  }
});

/**
 * Compare Password Method
 * Purpose: Checks if provided password matches hashed password
 * Parameters: candidatePassword (plain text password from login)
 * Returns: Boolean (true if match, false if not)
 * Used by: authController.js during login
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Get Public Profile Method
 * Purpose: Returns user object without sensitive data
 * Returns: User object without password
 * Used by: API responses to frontend
 */
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject(); // Convert to plain object
  delete userObject.password; // Remove password field
  return userObject; // Return safe user data
};

// Export Model
// Purpose: Create and export User model for use in controllers
module.exports = mongoose.model('User', userSchema);
