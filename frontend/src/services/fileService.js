import api from './api';

export const fileService = {
  async getProjectFiles(projectId) {
    const response = await api.get(`/files/project/${projectId}`);
    return response.data;
  },

  async getFile(fileId) {
    const response = await api.get(`/files/${fileId}`);
    return response.data;
  },

  async createFile(fileData) {
    const response = await api.post('/files', fileData);
    return response.data;
  },

  async updateFile(fileId, fileData) {
    const response = await api.put(`/files/${fileId}`, fileData);
    return response.data;
  },

  async renameFile(fileId, newName) {
    const response = await api.put(`/files/${fileId}/rename`, { newName });
    return response.data;
  },

  async deleteFile(fileId) {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  }
};
