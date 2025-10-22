/**
 * Validation Middleware
 * Purpose: Validates request data using Joi schemas
 * Used by: All routes to validate input before processing
 * Security: Prevents invalid/malicious data from reaching controllers
 */

const Joi = require('joi');

// User Validation Schemas
// Purpose: Validate user registration and login data

const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username can only contain letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Project validation schemas
const createProjectSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.max': 'Project name cannot exceed 100 characters'
    }),
  description: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  framework: Joi.string()
    .valid('react', 'vue', 'angular', 'vanilla')
    .default('react')
});

const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  description: Joi.string().max(500).allow(''),
  settings: Joi.object({
    framework: Joi.string().valid('react', 'vue', 'angular', 'vanilla'),
    autoSave: Joi.boolean(),
    theme: Joi.string().valid('light', 'dark')
  }),
  isPublic: Joi.boolean()
});

// File validation schemas
const createFileSchema = Joi.object({
  projectId: Joi.string().required(),
  parentId: Joi.string().allow(null),
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.max': 'File name cannot exceed 100 characters'
    }),
  type: Joi.string()
    .valid('file', 'folder')
    .required(),
  content: Joi.string()
    .max(102400) // 100KB limit
    .allow('')
    .when('type', {
      is: 'file',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),
  language: Joi.string()
    .valid('javascript', 'jsx', 'typescript', 'tsx', 'css', 'scss', 'html', 'json', 'markdown', 'text')
    .when('type', {
      is: 'file',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
});

const updateFileSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  content: Joi.string().max(102400).allow(''),
  language: Joi.string()
    .valid('javascript', 'jsx', 'typescript', 'tsx', 'css', 'scss', 'html', 'json', 'markdown', 'text')
});

/**
 * Validation Middleware Factory
 * Purpose: Creates validation middleware from Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 * Usage: router.post('/register', validate(registerSchema), controller)
 */
const validate = (schema) => {
  return (req, res, next) => {
    // Validate request body against schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just first
      stripUnknown: true // Remove unknown fields
    });

    // If validation fails, return error response
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'), // Field name (e.g., 'username')
        message: detail.message // Error message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors // Array of validation errors
      });
    }

    // Replace request body with validated/sanitized value
    req.body = value;
    
    // Continue to next middleware/controller
    next();
  };
};

// Export validation utilities
module.exports = {
  validate, // Middleware factory
  registerSchema, // User registration validation
  loginSchema, // User login validation
  createProjectSchema, // Project creation validation
  updateProjectSchema, // Project update validation
  createFileSchema, // File creation validation
  updateFileSchema // File update validation
};
