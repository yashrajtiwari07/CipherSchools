/**
 * Project Controller
 * Purpose: Handles project CRUD operations
 * Routes: /api/projects/*
 * Used by: routes/projects.js
 */

const Project = require('../models/Project');
const File = require('../models/File');
const mongoose = require('mongoose');
const { sanitizeProjectData } = require('../utils/sanitize');
const frameworkTemplates = require('../utils/frameworkTemplates');

/**
 * Generate Unique Project Slug
 * Purpose: Creates URL-friendly unique identifier for project
 * @param {String} name - Project name
 * @returns {String} Unique slug (e.g., 'my-react-app-abc123')
 * Example: "My React App!" → "my-react-app-k8j2n5"
 */
const generateProjectSlug = (name) => {
  const baseSlug = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 30); // Limit length to 30 chars
  
  // Add timestamp for uniqueness
  const timestamp = Date.now().toString(36); // Convert to base36 for shorter string
  return `${baseSlug}-${timestamp}`;
};

/**
 * Create New Project
 * @desc    Creates project with template files
 * @route   POST /api/projects
 * @access  Private
 * @body    { name, description, framework }
 * @returns { success, project }
 */
const createProject = async (req, res) => {
  try {
    // Sanitize input data to prevent XSS attacks
    const sanitizedData = sanitizeProjectData(req.body);
    const { name, description, framework = 'react' } = sanitizedData;

    // Generate unique project slug for URL
    const projectSlug = generateProjectSlug(name);

    // Create project in database
    const project = await Project.create({
      userId: req.user._id, // Link to authenticated user
      name,
      description,
      projectSlug,
      settings: {
        framework, // React (only option currently)
        autoSave: true, // Enable auto-save by default
        theme: 'light' // Light theme by default
      }
    });

    // Create root folder (src/) for project files
    const rootFolder = await File.create({
      projectId: project._id,
      name: 'src', // Root folder name
      type: 'folder',
      parentId: null // No parent (root level)
    });

    // Link root folder to project
    project.rootFolderId = rootFolder._id;
    await project.save();

    // Create initial files based on framework template
    const template = frameworkTemplates[framework] || frameworkTemplates['react'];
    
    const filePromises = template.files.map(file => 
      File.create({
        projectId: project._id,
        parentId: rootFolder._id,
        name: file.name,
        type: file.type,
        content: file.content,
        language: file.language
      })
    );
    
    await Promise.all(filePromises);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .sort({ lastOpened: -1 })
      .populate('rootFolderId');

    res.status(200).json({
      success: true,
      projects,
      count: projects.length
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get projects',
      error: error.message
    });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get project files
    const files = await File.find({ projectId: project._id })
      .sort({ type: -1, name: 1 });

    // Update last opened
    await project.updateLastOpened();

    res.status(200).json({
      success: true,
      project,
      files
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get project',
      error: error.message
    });
  }
};

const updateProject = async (req, res) => {
  try {
    // Sanitize input data
    const sanitizedData = sanitizeProjectData(req.body);
    
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      sanitizedData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete all project files
    await File.deleteMany({ projectId: project._id });

    // Delete project
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
