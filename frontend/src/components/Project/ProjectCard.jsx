import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFolder, 
  FiCalendar, 
  FiClock, 
  FiMoreVertical, 
  FiEdit3, 
  FiTrash2, 
  FiCopy, 
  FiExternalLink,
  FiCode,
  FiUser
} from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import { FRAMEWORK_OPTIONS } from '../../utils/constants';
import Button from '../UI/Button';
import './Project.css';

const ProjectCard = ({ 
  project, 
  onEdit, 
  onDelete, 
  onDuplicate,
  isLoading = false 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleActionClick = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    
    switch (action) {
      case 'edit':
        onEdit && onEdit(project);
        break;
      case 'delete':
        onDelete && onDelete(project);
        break;
      case 'duplicate':
        onDuplicate && onDuplicate(project);
        break;
      default:
        break;
    }
  };

  const getFrameworkLabel = (framework) => {
    const option = FRAMEWORK_OPTIONS.find(opt => opt.value === framework);
    return option ? option.label : framework;
  };

  const getFrameworkIcon = (framework) => {
    const icons = {
      'react': '⚛️',
      'vue': '💚',
      'angular': '🔺',
      'vanilla': '📄'
    };
    return icons[framework] || '📄';
  };

  if (isLoading) {
    return (
      <div className="project-card loading">
        <div className="project-card-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-menu"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-description"></div>
            <div className="skeleton-description short"></div>
          </div>
          <div className="skeleton-footer">
            <div className="skeleton-badge"></div>
            <div className="skeleton-date"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-card">
      <Link 
        to={`/project/${project._id}`} 
        className="project-card-link"
      >
        <div className="project-card-header">
          <div className="project-info">
            <div className="project-icon">
              <FiFolder />
            </div>
            <div className="project-details">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-slug">{project.projectSlug}</p>
            </div>
          </div>
          
          <div className="project-menu">
            <Button
              variant="ghost"
              size="small"
              onClick={handleMenuClick}
              className="menu-trigger"
              aria-label="Project actions"
            >
              <FiMoreVertical />
            </Button>
            
            {showMenu && (
              <div className="project-menu-dropdown">
                <button
                  className="menu-item"
                  onClick={(e) => handleActionClick('edit', e)}
                >
                  <FiEdit3 />
                  <span>Edit Project</span>
                </button>
                <button
                  className="menu-item"
                  onClick={(e) => handleActionClick('duplicate', e)}
                >
                  <FiCopy />
                  <span>Duplicate</span>
                </button>
                <div className="menu-divider" />
                <button
                  className="menu-item delete"
                  onClick={(e) => handleActionClick('delete', e)}
                >
                  <FiTrash2 />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="project-card-body">
          <p className="project-description">
            {project.description || 'No description provided.'}
          </p>
          
          <div className="project-stats">
            <div className="stat-item">
              <FiCode size={14} />
              <span>{project.fileCount || 0} files</span>
            </div>
            <div className="stat-item">
              <FiClock size={14} />
              <span>Modified {formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="project-card-footer">
          <div className="project-framework">
            <span className="framework-icon">
              {getFrameworkIcon(project.settings?.framework)}
            </span>
            <span className="framework-label">
              {getFrameworkLabel(project.settings?.framework)}
            </span>
          </div>
          
          <div className="project-dates">
            <div className="date-item">
              <FiCalendar size={12} />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            {project.lastOpened && (
              <div className="date-item">
                <FiExternalLink size={12} />
                <span>Opened {formatDate(project.lastOpened)}</span>
              </div>
            )}
          </div>
        </div>

        {project.isPublic && (
          <div className="project-badge public">
            <FiUser size={12} />
            <span>Public</span>
          </div>
        )}
      </Link>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="menu-overlay"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ProjectCard;
