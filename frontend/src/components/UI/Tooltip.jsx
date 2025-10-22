import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './UI.css';

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 500,
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    if (disabled || !content) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let top, left;
    const offset = 8;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + offset;
        break;
      default:
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
    }

    // Prevent tooltip from going outside viewport
    if (left < 0) left = 8;
    if (left + tooltipRect.width > viewport.width) {
      left = viewport.width - tooltipRect.width - 8;
    }
    if (top < 0) top = 8;
    if (top + tooltipRect.height > viewport.height) {
      top = viewport.height - tooltipRect.height - 8;
    }

    setTooltipStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 1000
    });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      
      const handleScroll = () => hideTooltip();
      const handleResize = () => hideTooltip();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible]);

  const tooltipClasses = [
    'tooltip',
    `tooltip-${position}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="tooltip-trigger"
      >
        {children}
      </div>
      
      {isVisible && content && createPortal(
        <div
          ref={tooltipRef}
          className={tooltipClasses}
          style={tooltipStyle}
          role="tooltip"
        >
          <div className="tooltip-content">
            {content}
          </div>
          <div className="tooltip-arrow" />
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
