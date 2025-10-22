/**
 * File Controller
 * Purpose: Handles file/folder CRUD operations
 * Routes: /api/files/*
 * Used by: routes/files.js
 */

const File = require('../models/File');
const Project = require('../models/Project');

/**
 * Get Project Files
 * @desc    Returns all files/folders in a project
 * @route   GET /api/files/project/:projectId
 * @access  Private
 * @returns { success, files, count }
 */
const getProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    // Purpose: Ensure user owns the project before showing files
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id // Check ownership
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get all files in project
    const files = await File.find({ projectId })
      .sort({ type: -1, name: 1 }); // Folders first, then files alphabetically

    res.status(200).json({
      success: true,
      files,
      count: files.length
    });

  } catch (error) {
    console.error('Get project files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get project files',
      error: error.message
    });
  }
};

/**
 * Get Single File
 * @desc    Returns specific file by ID
 * @route   GET /api/files/:id
 * @access  Private
 * @returns { success, file }
 */
const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: file.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      file
    });

  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file',
      error: error.message
    });
  }
};

// @desc    Create new file/folder
// @route   POST /api/files
// @access  Private
const createFile = async (req, res) => {
  try {
    const { projectId, parentId, name, type, content = '' } = req.body;

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if file/folder already exists in the same parent
    const existingFile = await File.findOne({
      projectId,
      parentId,
      name
    });

    if (existingFile) {
      return res.status(400).json({
        success: false,
        message: `${type === 'folder' ? 'Folder' : 'File'} with this name already exists`
      });
    }

    // Create file/folder
    const file = await File.create({
      projectId,
      parentId,
      name,
      type,
      content: type === 'file' ? content : undefined,
      language: type === 'file' ? File.getLanguageFromExtension(name) : undefined
    });

    res.status(201).json({
      success: true,
      message: `${type === 'folder' ? 'Folder' : 'File'} created successfully`,
      file
    });

  } catch (error) {
    console.error('Create file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create file',
      error: error.message
    });
  }
};

// @desc    Update file content
// @route   PUT /api/files/:id
// @access  Private
const updateFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: file.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update file
    const updatedFile = await File.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'File updated successfully',
      file: updatedFile
    });

  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update file',
      error: error.message
    });
  }
};

// @desc    Rename file/folder
// @route   PUT /api/files/:id/rename
// @access  Private
const renameFile = async (req, res) => {
  try {
    const { newName } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: file.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if new name already exists
    const existingFile = await File.findOne({
      projectId: file.projectId,
      parentId: file.parentId,
      name: newName,
      _id: { $ne: file._id }
    });

    if (existingFile) {
      return res.status(400).json({
        success: false,
        message: 'Name already exists'
      });
    }

    // Update file name and language if it's a file
    const updateData = { name: newName };
    if (file.type === 'file') {
      updateData.language = File.getLanguageFromExtension(newName);
    }

    const updatedFile = await File.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'File renamed successfully',
      file: updatedFile
    });

  } catch (error) {
    console.error('Rename file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rename file',
      error: error.message
    });
  }
};

// @desc    Delete file/folder
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: file.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // If it's a folder, delete all children recursively
    if (file.type === 'folder') {
      await deleteFileRecursively(file._id);
    }

    // Delete the file/folder
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `${file.type === 'folder' ? 'Folder' : 'File'} deleted successfully`
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};

// Helper function to delete files recursively
const deleteFileRecursively = async (parentId) => {
  const children = await File.find({ parentId });
  
  for (const child of children) {
    if (child.type === 'folder') {
      await deleteFileRecursively(child._id);
    }
    await File.findByIdAndDelete(child._id);
  }
};

module.exports = {
  getProjectFiles,
  getFile,
  createFile,
  updateFile,
  renameFile,
  deleteFile
};
