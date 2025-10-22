import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList,
  FiClock,
  FiAlphaAZ,
  FiCalendar,
  FiFolder // ✅ Added missing import
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
  const [sortBy, setSortBy] = useState('lastOpened'); // lastOpened, name, createdAt
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { user } = useAuth();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Filter + sort projects
  useEffect(() => {
    let filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'lastOpened':
        default:
          const aDate = new Date(a.lastOpened || a.updatedAt);
          const bDate = new Date(b.lastOpened || b.updatedAt);
          return bDate - aDate;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, sortBy]);

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
          <p>Welcome back, {user?.username}! You have {projects.length} projects.</p>
        </div>
        
        <Button
          onClick={() => setShowCreateModal(true)}
          className="create-project-btn"
        >
          <FiPlus /> New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="project-filters">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="sort-control">
            <FiFilter className="filter-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="lastOpened">Last Opened</option>
              <option value="name">Name A-Z</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>

          <div className="view-controls">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="small"
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FiGrid />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="small"
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FiList />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className={`projects-container ${viewMode}`}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={setEditingProject}
              onDelete={handleDeleteProject}
              onDuplicate={handleDuplicateProject}
            />
          ))
        ) : (
          <div className="empty-projects">
            {searchQuery ? (
              <div className="empty-search">
                <h3>No projects found</h3>
                <p>No projects match your search "{searchQuery}"</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FiFolder size={64} />
                </div>
                <h3>No projects yet</h3>
                <p>Create your first project to start building amazing applications</p>
                <Button onClick={() => setShowCreateModal(true)} size="large">
                  <FiPlus /> Create Your First Project
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
