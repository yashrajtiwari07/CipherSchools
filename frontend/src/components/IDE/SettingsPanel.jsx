import React from 'react';
import { FiSun, FiMoon, FiSave, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import './IDE.css';

const SettingsPanel = ({ 
  theme, 
  onThemeChange, 
  isAutoSave, 
  onAutoSaveToggle,
  project 
}) => {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title">Appearance</h3>
        
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Theme</span>
            <p className="settings-item-description">Choose your editor theme</p>
          </div>
          <div className="settings-item-control">
            <button
              className={`theme-button ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange('light')}
              title="Light Theme"
            >
              <FiSun />
              <span>Light</span>
            </button>
            <button
              className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
              title="Dark Theme"
            >
              <FiMoon />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Editor</h3>
        
        <div className="settings-item">
          <div className="settings-item-label">
            <span>Auto Save</span>
            <p className="settings-item-description">
              Automatically save files after 1 second of inactivity
            </p>
          </div>
          <div className="settings-item-control">
            <button
              className={`toggle-button ${isAutoSave ? 'active' : ''}`}
              onClick={onAutoSaveToggle}
              title={isAutoSave ? 'Disable Auto Save' : 'Enable Auto Save'}
            >
              {isAutoSave ? <FiToggleRight /> : <FiToggleLeft />}
              <span>{isAutoSave ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Project Information</h3>
        
        <div className="settings-info-grid">
          <div className="settings-info-item">
            <label>Project Name</label>
            <p>{project?.name || 'Untitled Project'}</p>
          </div>
          
          <div className="settings-info-item">
            <label>Framework</label>
            <p>{project?.settings?.framework || 'React'}</p>
          </div>
          
          <div className="settings-info-item">
            <label>Created</label>
            <p>{project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          
          <div className="settings-info-item">
            <label>Last Modified</label>
            <p>{project?.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Keyboard Shortcuts</h3>
        
        <div className="shortcuts-list">
          <div className="shortcut-item">
            <span className="shortcut-label">Save File</span>
            <kbd className="shortcut-key">Ctrl + S</kbd>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-label">New File</span>
            <kbd className="shortcut-key">Ctrl + N</kbd>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-label">Find</span>
            <kbd className="shortcut-key">Ctrl + F</kbd>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-label">Toggle Terminal</span>
            <kbd className="shortcut-key">Ctrl + `</kbd>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <p className="settings-version">CipherStudio v1.0.0</p>
        <p className="settings-copyright">© 2025 CipherStudio. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
