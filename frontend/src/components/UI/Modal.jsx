import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import Button from './Button';
import './UI.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  className = '',
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true
}) => {
  // Handle escape key
  const handleEscapeKey = useCallback((event) => {
    if (closeOnEscape && event.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((event) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      onClose();
    }
  }, [closeOnOverlay, onClose]);

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  const sizeClass = `modal-${size}`;
  const modalClasses = ['modal-content', sizeClass, className].filter(Boolean).join(' ');

  const modalContent = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={modalClasses} role="dialog" aria-modal="true">
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <FiX />
              </Button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
