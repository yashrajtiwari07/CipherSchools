import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { fileService } from '../services/fileService';

export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProject(projectId);
      setProject(response.project);
      setFiles(response.files || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const createFile = async (fileData) => {
    try {
      const response = await fileService.createFile(fileData);
      setFiles(prev => [...prev, response.file]);
      return response.file;
    } catch (err) {
      throw err;
    }
  };

  const updateFile = async (fileId, fileData) => {
    try {
      const response = await fileService.updateFile(fileId, fileData);
      setFiles(prev => 
        prev.map(file => 
          file._id === fileId ? response.file : file
        )
      );
      return response.file;
    } catch (err) {
      throw err;
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await fileService.deleteFile(fileId);
      setFiles(prev => prev.filter(file => file._id !== fileId));
    } catch (err) {
      throw err;
    }
  };

  const renameFile = async (fileId, newName) => {
    try {
      const response = await fileService.renameFile(fileId, newName);
      setFiles(prev => 
        prev.map(file => 
          file._id === fileId ? response.file : file
        )
      );
      return response.file;
    } catch (err) {
      throw err;
    }
  };

  return {
    project,
    files,
    loading,
    error,
    loadProject,
    createFile,
    updateFile,
    deleteFile,
    renameFile
  };
};
