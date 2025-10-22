/**
 * File Routes
 * Purpose: Defines file/folder CRUD endpoints
 * Base URL: /api/files
 * Used by: server.js
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validate, createFileSchema, updateFileSchema } = require('../middleware/validation');
const {
  getProjectFiles,
  getFile,
  createFile,
  updateFile,
  renameFile,
  deleteFile
} = require('../controllers/fileController');

/**
 * Get All Project Files
 * @route   GET /api/files/project/:projectId
 * @desc    Returns all files/folders in a project
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.get('/project/:projectId', authenticateToken, getProjectFiles);

/**
 * Create New File/Folder
 * @route   POST /api/files
 * @desc    Creates new file or folder
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 * @middleware validate(createFileSchema) - Validates file data
 */
router.post('/', authenticateToken, validate(createFileSchema), createFile);

/**
 * Get Single File
 * @route   GET /api/files/:id
 * @desc    Returns specific file by ID
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.get('/:id', authenticateToken, getFile);

/**
 * Update File Content
 * @route   PUT /api/files/:id
 * @desc    Updates file content
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 * @middleware validate(updateFileSchema) - Validates update data
 */
router.put('/:id', authenticateToken, validate(updateFileSchema), updateFile);

/**
 * Rename File/Folder
 * @route   PUT /api/files/:id/rename
 * @desc    Renames file or folder
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.put('/:id/rename', authenticateToken, renameFile);

/**
 * Delete File/Folder
 * @route   DELETE /api/files/:id
 * @desc    Deletes file or folder (and all children if folder)
 * @access  Private
 * @middleware authenticateToken - Verifies JWT
 */
router.delete('/:id', authenticateToken, deleteFile);

// Export router
module.exports = router;
