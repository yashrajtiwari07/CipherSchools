import React from 'react';
import { FiLoader } from 'react-icons/fi';
import './UI.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  title,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const fullWidthClass = fullWidth ? 'btn-full-width' : '';
  const disabledClass = (disabled || loading) ? 'btn-disabled' : '';
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick && onClick(e);
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      {...props}
    >
      {loading ? (
        <span className="btn-content">
          <FiLoader className="btn-spinner" />
          {children}
        </span>
      ) : (
        <span className="btn-content">
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
