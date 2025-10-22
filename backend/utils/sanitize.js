const sanitizeHtml = require('sanitize-html');

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @param {boolean} allowBasicFormatting - Whether to allow basic HTML formatting
 * @returns {string} - Sanitized string
 */
const sanitizeInput = (input, allowBasicFormatting = false) => {
  if (typeof input !== 'string') {
    return input;
  }

  if (allowBasicFormatting) {
    // Allow basic formatting tags for descriptions
    return sanitizeHtml(input, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
      allowedAttributes: {}
    });
  }

  // Strip all HTML tags for names and other fields
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
};

/**
 * Sanitize project data
 * @param {object} projectData - Project data to sanitize
 * @returns {object} - Sanitized project data
 */
const sanitizeProjectData = (projectData) => {
  const sanitized = { ...projectData };

  if (sanitized.name) {
    sanitized.name = sanitizeInput(sanitized.name);
  }

  if (sanitized.description) {
    sanitized.description = sanitizeInput(sanitized.description, true);
  }

  return sanitized;
};

/**
 * Sanitize file data
 * @param {object} fileData - File data to sanitize
 * @returns {object} - Sanitized file data
 */
const sanitizeFileData = (fileData) => {
  const sanitized = { ...fileData };

  if (sanitized.name) {
    sanitized.name = sanitizeInput(sanitized.name);
  }

  // Don't sanitize file content as it's code
  // Content validation is handled by size limits and language detection

  return sanitized;
};

/**
 * Sanitize user data
 * @param {object} userData - User data to sanitize
 * @returns {object} - Sanitized user data
 */
const sanitizeUserData = (userData) => {
  const sanitized = { ...userData };

  if (sanitized.username) {
    sanitized.username = sanitizeInput(sanitized.username);
  }

  if (sanitized.email) {
    sanitized.email = sanitizeInput(sanitized.email).toLowerCase();
  }

  return sanitized;
};

module.exports = {
  sanitizeInput,
  sanitizeProjectData,
  sanitizeFileData,
  sanitizeUserData
};
