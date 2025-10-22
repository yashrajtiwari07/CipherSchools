import React from 'react';
import { FiClock, FiUser, FiCode, FiZap } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';
import './IDE.css';

const StatusBar = ({ 
  project, 
  activeFile, 
  fileCount = 0, 
  lastSaved,
  isAutoSave = true 
}) => {
  const { user } = useAuth();

  const getFileStats = () => {
    if (!activeFile || !activeFile.content) return null;
    
    const content = activeFile.content;
    const lines = content.split('\n').length;
    const chars = content.length;
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    return { lines, chars, words };
  };

  const getLanguageDisplay = () => {
    if (!activeFile) return 'No file';
    
    const ext = activeFile.name.split('.').pop()?.toLowerCase();
    const languageMap = {
      'js': 'JavaScript',
      'jsx': 'React JSX',
      'ts': 'TypeScript',
      'tsx': 'React TSX',
      'css': 'CSS',
      'scss': 'SCSS',
      'html': 'HTML',
      'json': 'JSON',
      'md': 'Markdown'
    };
    
    return languageMap[ext] || ext?.toUpperCase() || 'Text';
  };

  const stats = getFileStats();

  return (
    <div className="status-bar">
      <div className="status-left">
        <div className="status-item">
          <FiUser size={14} />
          <span>{user?.username}</span>
        </div>
        
        {project && (
          <div className="status-item">
            <FiCode size={14} />
            <span>{project.name}</span>
          </div>
        )}
        
        <div className="status-item">
          <span>{fileCount} files</span>
        </div>
      </div>

      <div className="status-center">
        {activeFile && (
          <div className="status-item active-file">
            <span>{activeFile.name}</span>
            <span className="file-language">{getLanguageDisplay()}</span>
          </div>
        )}
      </div>

      <div className="status-right">
        {stats && (
          <>
            <div className="status-item">
              <span>Ln {stats.lines}</span>
            </div>
            <div className="status-item">
              <span>{stats.chars} chars</span>
            </div>
            <div className="status-item">
              <span>{stats.words} words</span>
            </div>
          </>
        )}
        
        {lastSaved && (
          <div className="status-item">
            <FiClock size={14} />
            <span title={formatDate(lastSaved)}>
              Saved {formatDate(lastSaved)}
            </span>
          </div>
        )}
        
        <div className="status-item">
          <FiZap size={14} />
          <span>{isAutoSave ? 'Auto-save On' : 'Auto-save Off'}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
