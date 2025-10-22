import { useState, useCallback, useEffect } from 'react';
import { fileService } from '../services/fileService';
import { buildFileTree, getLanguageFromExtension } from '../utils/fileUtils';

export const useFileSystem = (projectId) => {
  const [files, setFiles] = useState([]);
  const [fileTree, setFileTree] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all files for the project
  const loadFiles = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fileService.getProjectFiles(projectId);
      const filesData = response.files || [];
      
      setFiles(filesData);
      setFileTree(buildFileTree(filesData));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Auto-load files when projectId changes
  useEffect(() => {
    if (projectId) {
      loadFiles();
    }
  }, [projectId, loadFiles]);

  // Create a new file or folder
  const createFile = useCallback(async (fileData) => {
    try {
      const response = await fileService.createFile({
        ...fileData,
        projectId,
        language: fileData.type === 'file' ? getLanguageFromExtension(fileData.name) : undefined
      });

      const newFile = response.file;
      setFiles(prev => {
        const updatedFiles = [...prev, newFile];
        setFileTree(buildFileTree(updatedFiles));
        return updatedFiles;
      });

      return newFile;
    } catch (err) {
      throw err;
    }
  }, [projectId]);

  // Update file content
  const updateFileContent = useCallback(async (fileId, content) => {
    try {
      const response = await fileService.updateFile(fileId, { content });
      const updatedFile = response.file;

      setFiles(prev =>
        prev.map(file =>
          file._id === fileId ? updatedFile : file
        )
      );

      // Update active file if it's the same file
      if (activeFile && activeFile._id === fileId) {
        setActiveFile(updatedFile);
      }

      return updatedFile;
    } catch (err) {
      throw err;
    }
  }, [activeFile]);

  // Rename file or folder
  const renameFile = useCallback(async (fileId, newName) => {
    try {
      const response = await fileService.renameFile(fileId, newName);
      const renamedFile = response.file;

      setFiles(prev => {
        const updatedFiles = prev.map(file =>
          file._id === fileId ? renamedFile : file
        );
        setFileTree(buildFileTree(updatedFiles));
        return updatedFiles;
      });

      // Update active file if it's the same file
      if (activeFile && activeFile._id === fileId) {
        setActiveFile(renamedFile);
      }

      return renamedFile;
    } catch (err) {
      throw err;
    }
  }, [activeFile]);

  // Delete file or folder
  const deleteFile = useCallback(async (fileId) => {
    try {
      await fileService.deleteFile(fileId);

      // Remove from files array and rebuild tree
      const updatedFiles = files.filter(file => file._id !== fileId);
      setFiles(updatedFiles);
      setFileTree(buildFileTree(updatedFiles));

      // Close active file if it was deleted
      if (activeFile && activeFile._id === fileId) {
        setActiveFile(null);
      }

      return true;
    } catch (err) {
      throw err;
    }
  }, [files, activeFile]);

  // Open a file (load its content)
  const openFile = useCallback(async (file) => {
    if (file.type === 'folder') return;

    try {
      setLoading(true);
      const response = await fileService.getFile(file._id);
      const fileWithContent = response.file;
      
      setActiveFile(fileWithContent);
      return fileWithContent;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to open file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Close active file
  const closeFile = useCallback(() => {
    setActiveFile(null);
  }, []);

  // Get file by ID
  const getFileById = useCallback((fileId) => {
    return files.find(file => file._id === fileId);
  }, [files]);

  // Check if file exists in current directory
  const fileExists = useCallback((name, parentId = null) => {
    return files.some(file => 
      file.name === name && file.parentId === parentId
    );
  }, [files]);

  // Get files in a specific directory
  const getFilesInDirectory = useCallback((parentId = null) => {
    return files.filter(file => file.parentId === parentId);
  }, [files]);

  return {
    // State
    files,
    fileTree,
    activeFile,
    loading,
    error,

    // Actions
    loadFiles,
    createFile,
    updateFileContent,
    renameFile,
    deleteFile,
    openFile,
    closeFile,

    // Utilities
    getFileById,
    fileExists,
    getFilesInDirectory,
    setActiveFile
  };
};
