/**
 * Project Model
 * Purpose: Defines schema for user projects
 * Used by: projectController.js, fileController.js
 * Database: MongoDB collection 'projects'
 */

const mongoose = require('mongoose');

// Project Schema Definition
// Purpose: Stores project metadata, settings, and references
const projectSchema = new mongoose.Schema({
  // Project Slug
  // Purpose: URL-friendly unique identifier (e.g., 'my-react-app-abc123')
  projectSlug: {
    type: String,
    unique: true, // No duplicate slugs allowed
    index: true // Indexed for fast URL lookups
    // Not required - generated automatically in controller
  },
  
  // User Reference
  // Purpose: Links project to its owner
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References User model
    required: true, // Every project must have an owner
    index: true // Indexed for querying user's projects
  },
  // Project Name
  // Purpose: Display name for the project (e.g., 'My React App')
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true, // Remove whitespace
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  
  // Project Description
  // Purpose: Optional description of what the project does
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '' // Empty by default
  },
  // Root Folder Reference
  // Purpose: Links to the root folder of the project file tree
  rootFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File', // References File model (folder type)
    default: null // Set when project is created
  },
  // Project Settings
  // Purpose: Stores IDE configuration for this project
  settings: {
    // Framework Type
    framework: {
      type: String,
      enum: ['react'], // Only React supported currently
      default: 'react'
    },
    // Auto-Save Feature
    autoSave: {
      type: Boolean,
      default: true // Auto-save enabled by default
    },
    // Editor Theme
    theme: {
      type: String,
      enum: ['light', 'dark'], // Light or dark mode
      default: 'light'
    }
  },
  // Public/Private Flag
  // Purpose: Determines if project is visible to others
  isPublic: {
    type: Boolean,
    default: false // Private by default
  },
  
  // Project Tags
  // Purpose: Categorize projects (e.g., ['portfolio', 'tutorial'])
  tags: [{
    type: String,
    maxlength: 20 // Max 20 characters per tag
  }],
  
  // Last Opened Timestamp
  // Purpose: Track when project was last accessed
  lastOpened: {
    type: Date,
    default: Date.now // Set to current time on creation
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Database Indexes
// Purpose: Speed up common queries
projectSchema.index({ userId: 1, createdAt: -1 }); // Get user's projects sorted by date
projectSchema.index({ projectSlug: 1 }); // Find project by slug (for URLs)
projectSchema.index({ isPublic: 1 }); // Filter public/private projects

// Virtual Property: File Count
// Purpose: Counts how many files are in this project (not stored in DB)
projectSchema.virtual('fileCount', {
  ref: 'File', // Reference File model
  localField: '_id', // Match project's _id
  foreignField: 'projectId', // With file's projectId
  count: true // Return count instead of documents
});

/**
 * Update Last Opened Method
 * Purpose: Updates the lastOpened timestamp when user opens project
 * Returns: Promise (saves to database)
 * Used by: projectController.js when project is accessed
 */
projectSchema.methods.updateLastOpened = function() {
  this.lastOpened = new Date(); // Set to current time
  return this.save(); // Save to database
};

// Export Model
// Purpose: Create and export Project model for use in controllers
module.exports = mongoose.model('Project', projectSchema);
