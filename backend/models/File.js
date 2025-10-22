/**
 * File Model
 * Purpose: Defines schema for files and folders in projects
 * Used by: fileController.js, projectController.js
 * Database: MongoDB collection 'files'
 */

const mongoose = require('mongoose');

// File Schema Definition
// Purpose: Stores file/folder metadata and content
const fileSchema = new mongoose.Schema({
  // Project Reference
  // Purpose: Links file to its parent project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // References Project model
    required: true,
    index: true // Indexed for fast queries
  },
  // Parent Folder Reference
  // Purpose: Creates folder hierarchy (null = root level)
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File', // References another File (folder)
    default: null, // null means root level
    index: true // Indexed for folder tree queries
  },
  // File/Folder Name
  // Purpose: Stores the name (e.g., 'App.jsx', 'components')
  name: {
    type: String,
    required: [true, 'File name is required'],
    trim: true, // Remove whitespace
    maxlength: [100, 'File name cannot exceed 100 characters']
  },
  // Type: File or Folder
  // Purpose: Distinguishes between files and folders
  type: {
    type: String,
    enum: ['file', 'folder'], // Only these two values allowed
    required: true,
    index: true // Indexed for filtering
  },
  // File Content
  // Purpose: Stores the actual code/text (only for files, not folders)
  content: {
    type: String,
    default: '',
    maxlength: [102400, 'File content cannot exceed 100KB'] // 100KB = 102400 bytes limit
  },
  // Programming Language
  // Purpose: Determines syntax highlighting in editor
  language: {
    type: String,
    enum: ['javascript', 'jsx', 'typescript', 'tsx', 'css', 'scss', 'html', 'json', 'markdown', 'text'],
    required: function() {
      return this.type === 'file'; // Only required for files, not folders
    }
  },
  // File Encoding
  // Purpose: Character encoding (usually UTF-8)
  encoding: {
    type: String,
    default: 'utf8' // Standard text encoding
  },
  
  // File Size
  // Purpose: Stores file size in bytes (calculated automatically)
  sizeInBytes: {
    type: Number,
    default: 0 // Calculated in pre-save hook
  },
  
  // Read-Only Flag
  // Purpose: Prevents editing of certain files
  isReadOnly: {
    type: Boolean,
    default: false // false = editable, true = read-only
  },
  
  // File Path
  // Purpose: Full path from root (e.g., '/src/components/App.jsx')
  path: {
    type: String,
    default: '/' // Root path
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Compound Indexes
// Purpose: Speed up common queries
fileSchema.index({ projectId: 1, parentId: 1 }); // Get files in a folder
fileSchema.index({ projectId: 1, type: 1 }); // Get all files or all folders
fileSchema.index({ projectId: 1, name: 1 }); // Find file by name in project

// Pre-Save Hook
// Purpose: Automatically calculate file size before saving
fileSchema.pre('save', function(next) {
  // Only calculate size for files (not folders) with content
  if (this.type === 'file' && this.content) {
    this.sizeInBytes = Buffer.byteLength(this.content, this.encoding || 'utf8');
  }
  next(); // Continue with save operation
});

/**
 * Get File Extension
 * Purpose: Extracts extension from filename (e.g., 'jsx' from 'App.jsx')
 * Returns: Extension string or null for folders
 */
fileSchema.methods.getExtension = function() {
  if (this.type === 'folder') return null; // Folders don't have extensions
  const lastDot = this.name.lastIndexOf('.'); // Find last dot
  return lastDot > 0 ? this.name.slice(lastDot + 1) : ''; // Return extension or empty string
};

/**
 * Check if File is Empty
 * Purpose: Determines if file has no content
 * Returns: true if empty, false if has content
 */
fileSchema.methods.isEmpty = function() {
  return this.type === 'file' && (!this.content || this.content.trim().length === 0);
};

/**
 * Get Language from Extension (Static Method)
 * Purpose: Determines programming language from filename
 * Parameters: filename (e.g., 'App.jsx')
 * Returns: Language string (e.g., 'jsx')
 * Used by: File creation to auto-detect language
 */
fileSchema.statics.getLanguageFromExtension = function(filename) {
  const ext = filename.split('.').pop()?.toLowerCase(); // Extract extension
  
  // Extension to Language Mapping
  const extensionMap = {
    'js': 'javascript',   // JavaScript files
    'jsx': 'jsx',         // React JSX files
    'ts': 'typescript',   // TypeScript files
    'tsx': 'tsx',         // React TypeScript files
    'css': 'css',         // CSS stylesheets
    'scss': 'scss',       // SCSS stylesheets
    'html': 'html',       // HTML files
    'json': 'json',       // JSON files
    'md': 'markdown',     // Markdown files
    'txt': 'text'         // Plain text files
  };
  
  return extensionMap[ext] || 'text'; // Default to 'text' if unknown
};

// Export Model
// Purpose: Create and export File model for use in controllers
module.exports = mongoose.model('File', fileSchema);
