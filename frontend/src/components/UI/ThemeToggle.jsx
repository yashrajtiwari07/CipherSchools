import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { THEMES } from '../../utils/constants';
import Button from './Button';
import './UI.css';

const ThemeToggle = ({ theme, onToggle, size = 'medium', showLabel = false }) => {
  const isDark = theme === THEMES.DARK;
  
  const handleToggle = () => {
    onToggle();
    
    // Apply theme to document
    const newTheme = isDark ? THEMES.LIGHT : THEMES.DARK;
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className="theme-icon">
        {isDark ? <FiSun /> : <FiMoon />}
      </span>
      {showLabel && (
        <span className="theme-label">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;
