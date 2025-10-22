import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiInfo, FiSettings } from 'react-icons/fi';
import { FRAMEWORK_OPTIONS } from '../../utils/constants';
import { validateProjectName } from '../../utils/helpers';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import Loader from '../UI/Loader';
import './Project.css';

const ProjectModal = ({ 
  isOpen = false, 
  onClose, 
  onSubmit, 
  project = null,
  title = 'Create Project' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    framework: 'react',
    isPublic: false,
    settings: {
      autoSave: true,
      theme: 'dark'
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          name: project.name || '',
          description: project.description || '',
          framework: project.settings?.framework || 'react',
          isPublic: project.isPublic || false,
          settings: {
            autoSave: project.settings?.autoSave ?? true,
            theme: project.settings?.theme || 'dark'
          }
        });
      } else {
        setFormData({
          name: '',
          description: '',
          framework: 'react',
          isPublic: false,
          settings: {
            autoSave: true,
            theme: 'dark'
          }
        });
      }
      setErrors({});
      setActiveTab('basic');
    }
  }, [isOpen, project]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSettingsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Project name cannot exceed 100 characters';
    } else if (!validateProjectName(formData.name)) {
      newErrors.name = 'Project name contains invalid characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 
                `Failed to ${project ? 'update' : 'create'} project`
      });
    } finally {
      setLoading(false);
    }
  };

  const getFrameworkIcon = (framework) => {
    const icons = {
      react: '⚛️',
      vue: '💚',
      angular: '🔺',
      vanilla: '📄'
    };
    return icons[framework] || '📄';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="large"
      className="project-modal"
    >
      <form onSubmit={handleSubmit} className="project-form">
        {/* Tabs */}
        <div className="form-tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <FiInfo /> Basic Info
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings /> Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'basic' && (
            <div className="tab-panel">
              {/* Project Name */}
              <div className="form-group">
                <label htmlFor="projectName" className="form-label required">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="My Awesome Project"
                  disabled={loading}
                  maxLength={100}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
                <div className="form-hint">
                  Choose a descriptive name for your project
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="projectDescription" className="form-label">
                  Description
                </label>
                <textarea
                  id="projectDescription"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Describe what your project does..."
                  disabled={loading}
                  rows={3}
                  maxLength={500}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
                <div className="form-hint">
                  {formData.description.length}/500 characters
                </div>
              </div>

              {/* Framework */}
              <div className="form-group">
                <label className="form-label">Framework</label>
                <div className="framework-options">
                  {FRAMEWORK_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`framework-option ${
                        formData.framework === option.value ? 'selected' : ''
                      }`}
                      onClick={() => handleChange('framework', option.value)}
                      disabled={loading}
                    >
                      <span className="framework-icon">{getFrameworkIcon(option.value)}</span>
                      <span className="framework-name">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => handleChange('isPublic', e.target.checked)}
                    disabled={loading}
                  />
                  <label htmlFor="isPublic" className="checkbox-label">
                    Make this project public
                  </label>
                </div>
                <div className="form-hint">
                  Public projects can be viewed by anyone
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-panel">
              {/* Auto-save */}
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="autoSave"
                    checked={formData.settings.autoSave}
                    onChange={(e) => handleSettingsChange('autoSave', e.target.checked)}
                    disabled={loading}
                  />
                  <label htmlFor="autoSave" className="checkbox-label">
                    Enable auto-save
                  </label>
                </div>
                <div className="form-hint">
                  Automatically save changes while you code
                </div>
              </div>

              {/* Theme */}
              <div className="form-group">
                <label className="form-label">Default Theme</label>
                <div className="theme-options">
                  {['light', 'dark'].map(theme => (
                    <button
                      key={theme}
                      type="button"
                      className={`theme-option ${
                        formData.settings.theme === theme ? 'selected' : ''
                      }`}
                      onClick={() => handleSettingsChange('theme', theme)}
                      disabled={loading}
                    >
                      <div className={`theme-preview ${theme}`}>
                        <div className="theme-bar"></div>
                        <div className="theme-content"></div>
                      </div>
                      <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        {/* Actions */}
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Loader size="small" /> : project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

ProjectModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  project: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    isPublic: PropTypes.bool,
    settings: PropTypes.shape({
      framework: PropTypes.string,
      autoSave: PropTypes.bool,
      theme: PropTypes.string
    })
  }),
  title: PropTypes.string
};

export default ProjectModal;
