import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMoreVertical, 
  FiEdit3, 
  FiTrash2, 
  FiCopy
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
            <h3 className="project-name">{project.name}</h3>
            <p className="project-description">
              {project.description || 'No description'}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="small"
            onClick={handleMenuClick}
            className="menu-trigger"
            aria-label="Project actions"
          >
            <FiMoreVertical />
          </Button>
        </div>

        <div className="project-card-footer">
          <span className="project-framework">
            {getFrameworkLabel(project.settings?.framework)}
          </span>
          <span className="project-date">
            {formatDate(project.updatedAt)}
          </span>
        </div>
      </Link>

      {showMenu && (
        <div className="project-menu-dropdown">
          <button
            className="menu-item"
            onClick={(e) => handleActionClick('edit', e)}
          >
            <FiEdit3 />
            <span>Edit</span>
          </button>
          <button
            className="menu-item"
            onClick={(e) => handleActionClick('duplicate', e)}
          >
            <FiCopy />
            <span>Copy</span>
          </button>
          <button
            className="menu-item delete"
            onClick={(e) => handleActionClick('delete', e)}
          >
            <FiTrash2 />
            <span>Delete</span>
          </button>
        </div>
      )}

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
