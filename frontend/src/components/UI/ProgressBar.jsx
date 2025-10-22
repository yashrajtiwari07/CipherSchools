import React from 'react';
import './UI.css';

const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'medium',
  variant = 'primary',
  showLabel = false,
  label,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const progressClasses = [
    'progress-bar',
    `progress-${size}`,
    `progress-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={progressClasses}>
      {(showLabel || label) && (
        <div className="progress-label">
          <span className="progress-text">
            {label || `${Math.round(percentage)}%`}
          </span>
          {showLabel && !label && (
            <span className="progress-value">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
