import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          name: project.name || '',
          description: project.description || ''
        });
      } else {
        setFormData({
          name: '',
          description: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, project]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="large"
      className="project-modal"
    >
      <form onSubmit={handleSubmit} className="project-form">

        {/* Project Name */}
        <div className="form-group">
          <label htmlFor="projectName" className="form-label">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="My React Project"
            disabled={loading}
            maxLength={100}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="projectDescription" className="form-label">
            Description (Optional)
          </label>
          <textarea
            id="projectDescription"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="What will you build?"
            disabled={loading}
            rows={3}
            maxLength={500}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
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
    description: PropTypes.string
  }),
  title: PropTypes.string
};

export default ProjectModal;
