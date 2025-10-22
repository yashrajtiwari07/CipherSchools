const Project = require('../models/Project');
const File = require('../models/File');

class ProjectService {
  // Get all user projects
  async getUserProjects(userId) {
    try {
      const projects = await Project.find({ userId })
        .sort({ lastOpened: -1 })
        .populate('rootFolderId');

      return projects;

    } catch (error) {
      throw error;
    }
  }

  // Get single project with files
  async getProjectById(projectId, userId) {
    try {
      const project = await Project.findOne({
        _id: projectId,
        userId
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Get project files
      const files = await File.find({ projectId })
        .sort({ type: -1, name: 1 });

      // Update last opened
      await project.updateLastOpened();

      return {
        project,
        files
      };

    } catch (error) {
      throw error;
    }
  }

  // Create new project
  async createProject(userId, projectData) {
    try {
      const { name, description, framework = 'react' } = projectData;

      // Create project
      const project = await Project.create({
        userId,
        name,
        description,
        settings: {
          framework,
          autoSave: true,
          theme: 'light'
        }
      });

      // Create root folder
      const rootFolder = await File.create({
        projectId: project._id,
        name: 'src',
        type: 'folder',
        parentId: null
      });

      // Update project with root folder ID
      project.rootFolderId = rootFolder._id;
      await project.save();

      // Create initial files
      await this.createInitialFiles(project._id, rootFolder._id, framework);

      return project;

    } catch (error) {
      throw error;
    }
  }

  // Update project
  async updateProject(projectId, userId, updateData) {
    try {
      const project = await Project.findOneAndUpdate(
        { _id: projectId, userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!project) {
        throw new Error('Project not found');
      }

      return project;

    } catch (error) {
      throw error;
    }
  }

  // Delete project
  async deleteProject(projectId, userId) {
    try {
      const project = await Project.findOne({
        _id: projectId,
        userId
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Delete all project files
      await File.deleteMany({ projectId });

      // Delete project
      await Project.findByIdAndDelete(projectId);

      return { message: 'Project deleted successfully' };

    } catch (error) {
      throw error;
    }
  }

  // Create initial files based on framework
  async createInitialFiles(projectId, rootFolderId, framework) {
    try {
      const initialFiles = [
        {
          name: 'App.jsx',
          content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CipherStudio</h1>
        <p>Start building your amazing ${framework} application!</p>
      </header>
    </div>
  );
}

export default App;`
        },
        {
          name: 'App.css',
          content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  margin: 0 0 1rem 0;
}

p {
  font-size: 1.2rem;
}`
        },
        {
          name: 'index.js',
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
        }
      ];

      for (const file of initialFiles) {
        await File.create({
          projectId,
          parentId: rootFolderId,
          name: file.name,
          type: 'file',
          content: file.content,
          language: File.getLanguageFromExtension(file.name)
        });
      }

    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProjectService();
