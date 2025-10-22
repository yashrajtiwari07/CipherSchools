/**
 * Project Routes
 * Purpose: Defines project CRUD endpoints
 * Base URL: /api/projects
 * Used by: server.js
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validate, createProjectSchema, updateProjectSchema } = require('../middleware/validation');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

/**
 * Get All User Projects
 * @route   GET /api/projects
 * @desc    Returns all projects owned by authenticated user
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.get('/', authenticateToken, getProjects);

/**
 * Create New Project
 * @route   POST /api/projects
 * @desc    Creates new project with template files
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 * @middleware validate(createProjectSchema) - Validates name, description, framework
 */
router.post('/', authenticateToken, validate(createProjectSchema), createProject);

/**
 * Get Single Project
 * @route   GET /api/projects/:id
 * @desc    Returns specific project by ID
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.get('/:id', authenticateToken, getProject);

/**
 * Update Project
 * @route   PUT /api/projects/:id
 * @desc    Updates project details
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 * @middleware validate(updateProjectSchema) - Validates update data
 */
router.put('/:id', authenticateToken, validate(updateProjectSchema), updateProject);

/**
 * Delete Project
 * @route   DELETE /api/projects/:id
 * @desc    Deletes project and all its files
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.delete('/:id', authenticateToken, deleteProject);

// Export router
module.exports = router;
