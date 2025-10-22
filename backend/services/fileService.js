const File = require('../models/File');
const Project = require('../models/Project');

class FileService {
  // Get all files for a project
  async getProjectFiles(projectId, userId) {
    try {
      // Verify project ownership
      const project = await Project.findOne({
        _id: projectId,
        userId
      });

      if (!project) {
        throw new Error('Project not found');
      }

      const files = await File.find({ projectId })
        .sort({ type: -1, name: 1 });

      return files;

    } catch (error) {
      throw error;
    }
  }

  // Get single file
  async getFileById(fileId, userId) {
    try {
      const file = await File.findById(fileId);

      if (!file) {
        throw new Error('File not found');
      }

      // Verify project ownership
      const project = await Project.findOne({
        _id: file.projectId,
        userId
      });

      if (!project) {
        throw new Error('Access denied');
      }

      return file;

    } catch (error) {
      throw error;
    }
  }

  // Create new file/folder
  async createFile(userId, fileData) {
    try {
      const { projectId, parentId, name, type, content = '' } = fileData;

      // Verify project ownership
      const project = await Project.findOne({
        _id: projectId,
        userId
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Check if file already exists
      const existingFile = await File.findOne({
        projectId,
        parentId,
        name
      });

      if (existingFile) {
        throw new Error(`${type === 'folder' ? 'Folder' : 'File'} with this name already exists`);
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

      return file;

    } catch (error) {
      throw error;
    }
  }

  // Update file content
  async updateFile(fileId, userId, updateData) {
    try {
      const file = await File.findById(fileId);

      if (!file) {
        throw new Error('File not found');
      }

      // Verify project ownership
      const project = await Project.findOne({
        _id: file.projectId,
        userId
      });

      if (!project) {
        throw new Error('Access denied');
      }

      // Update file
      const updatedFile = await File.findByIdAndUpdate(
        fileId,
        updateData,
        { new: true, runValidators: true }
      );

      return updatedFile;

    } catch (error) {
      throw error;
    }
  }

  // Rename file/folder
  async renameFile(fileId, userId, newName) {
    try {
      const file = await File.findById(fileId);

      if (!file) {
        throw new Error('File not found');
      }

      // Verify project ownership
      const project = await Project.findOne({
        _id: file.projectId,
        userId
      });

      if (!project) {
        throw new Error('Access denied');
      }

      // Check if new name already exists
      const existingFile = await File.findOne({
        projectId: file.projectId,
        parentId: file.parentId,
        name: newName,
        _id: { $ne: fileId }
      });

      if (existingFile) {
        throw new Error('Name already exists');
      }

      // Update file name and language
      const updateData = { name: newName };
      if (file.type === 'file') {
        updateData.language = File.getLanguageFromExtension(newName);
      }

      const updatedFile = await File.findByIdAndUpdate(fileId, updateData, { new: true });

      return updatedFile;

    } catch (error) {
      throw error;
    }
  }

  // Delete file/folder
  async deleteFile(fileId, userId) {
    try {
      const file = await File.findById(fileId);

      if (!file) {
        throw new Error('File not found');
      }

      // Verify project ownership
      const project = await Project.findOne({
        _id: file.projectId,
        userId
      });

      if (!project) {
        throw new Error('Access denied');
      }

      // If folder, delete recursively
      if (file.type === 'folder') {
        await this.deleteFilesRecursively(fileId);
      }

      // Delete the file/folder
      await File.findByIdAndDelete(fileId);

      return { message: `${file.type === 'folder' ? 'Folder' : 'File'} deleted successfully` };

    } catch (error) {
      throw error;
    }
  }

  // Helper method to delete files recursively
  async deleteFilesRecursively(parentId) {
    try {
      const children = await File.find({ parentId });
      
      for (const child of children) {
        if (child.type === 'folder') {
          await this.deleteFilesRecursively(child._id);
        }
        await File.findByIdAndDelete(child._id);
      }

    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FileService();
