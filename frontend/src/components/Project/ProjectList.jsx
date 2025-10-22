import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch
} from 'react-icons/fi';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../hooks/useAuth';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import Button from '../UI/Button';
import Loader from '../UI/Loader';
import './Project.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { user } = useAuth();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Filter projects
  useEffect(() => {
    let filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by most recent
    filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    setFilteredProjects(filtered);
  }, [projects, searchQuery]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getProjects();
      setProjects(response.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await projectService.createProject(projectData);
      setProjects(prev => [response.project, ...prev]);
      setShowCreateModal(false);
      return response.project;
    } catch (err) {
      throw err;
    }
  };

  const handleEditProject = async (projectId, projectData) => {
    try {
      const response = await projectService.updateProject(projectId, projectData);
      setProjects(prev =>
        prev.map(project =>
          project._id === projectId ? response.project : project
        )
      );
      setEditingProject(null);
      return response.project;
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      try {
        await projectService.deleteProject(project._id);
        setProjects(prev => prev.filter(p => p._id !== project._id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const handleDuplicateProject = async (project) => {
    try {
      const duplicateData = {
        name: `${project.name} (Copy)`,
        description: project.description,
        framework: project.settings?.framework || 'react'
      };
      const response = await projectService.createProject(duplicateData);
      setProjects(prev => [response.project, ...prev]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to duplicate project');
    }
  };

  if (loading) {
    return (
      <div className="project-list-loading">
        <Loader size="large" />
        <p>Loading your projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-list-error">
        <div className="error-content">
          <h3>Failed to load projects</h3>
          <p>{error}</p>
          <Button onClick={loadProjects}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-list">
      {/* Header */}
      <div className="project-list-header">
        <div className="header-title">
          <h1>My Projects</h1>
          <p>{projects.length} projects</p>
        </div>
        
        <Button
          onClick={() => setShowCreateModal(true)}
          className="create-project-btn"
        >
          <FiPlus /> New Project
        </Button>
      </div>

      {/* Search */}
      <div className="project-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Projects */}
      <div className="projects-container">
        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={setEditingProject}
                onDelete={handleDeleteProject}
                onDuplicate={handleDuplicateProject}
              />
            ))}
          </div>
        ) : (
          <div className="empty-projects">
            {searchQuery ? (
              <div className="empty-search">
                <h3>No projects found</h3>
                <p>Try a different search term</p>
              </div>
            ) : (
              <div className="empty-state">
                <h3>No projects yet</h3>
                <p>Create your first project to get started</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <FiPlus /> Create Project
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <ProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        title="Create New Project"
      />

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={(data) => handleEditProject(editingProject._id, data)}
        project={editingProject}
        title="Edit Project"
      />
    </div>
  );
};

export default ProjectList;
