import React from 'react';
import './UI.css';

const Loader = ({ 
  size = 'medium', 
  variant = 'spinner',
  color = 'primary',
  text,
  className = '' 
}) => {
  const sizeClass = `loader-${size}`;
  const variantClass = `loader-${variant}`;
  const colorClass = `loader-${color}`;
  
  const loaderClasses = [
    'loader',
    sizeClass,
    variantClass,
    colorClass,
    className
  ].filter(Boolean).join(' ');

  if (variant === 'dots') {
    return (
      <div className={`${loaderClasses} loader-container`}>
        <div className="loader-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        {text && <span className="loader-text">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${loaderClasses} loader-container`}>
        <div className="loader-pulse">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
        </div>
        {text && <span className="loader-text">{text}</span>}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`${loaderClasses} loader-container`}>
        <div className="loader-bars">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        {text && <span className="loader-text">{text}</span>}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`${loaderClasses} loader-container`}>
      <div className="loader-spinner">
        <svg viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
          />
        </svg>
      </div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
};

export default Loader;
