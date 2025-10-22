import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FiCheck, 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiInfo, 
  FiX 
} from 'react-icons/fi';
import Button from './Button';
import './UI.css';

// Toast context and provider
export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast container component
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

// Individual toast component
const Toast = ({ 
  id,
  type = 'info',
  title,
  message,
  action,
  persistent = false,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck />;
      case 'error':
        return <FiAlertCircle />;
      case 'warning':
        return <FiAlertTriangle />;
      case 'info':
      default:
        return <FiInfo />;
    }
  };

  const toastClasses = [
    'toast',
    `toast-${type}`,
    isVisible ? 'toast-visible' : '',
    isExiting ? 'toast-exiting' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={toastClasses}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        {message && <div className="toast-message">{message}</div>}
        {action && (
          <div className="toast-action">
            {action}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="small"
        onClick={handleClose}
        className="toast-close"
        aria-label="Close notification"
      >
        <FiX />
      </Button>
    </div>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;
