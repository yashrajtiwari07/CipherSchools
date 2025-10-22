import React, { useState } from 'react';
import { 
  FiFolder, 
  FiTerminal, 
  FiSettings,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import Button from '../UI/Button';
import './Layout.css';

const Sidebar = ({ 
  activeTab = 'explorer',
  onTabChange,
  isCollapsed = false,
  onToggleCollapse,
  children 
}) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  const sidebarTabs = [
    {
      id: 'explorer',
      icon: FiFolder,
      label: 'Explorer',
      tooltip: 'File Explorer'
    },
    {
      id: 'terminal',
      icon: FiTerminal,
      label: 'Terminal',
      tooltip: 'Integrated Terminal'
    }
  ];

  const handleTabClick = (tabId) => {
    // If sidebar is collapsed, expand it first
    if (isCollapsed && onToggleCollapse) {
      onToggleCollapse();
    }
    
    // Toggle the tab (close if clicking same tab, open if different)
    if (onTabChange) {
      onTabChange(tabId === activeTab ? null : tabId);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Tab Bar */}
      <div className="sidebar-tabs">
        {sidebarTabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`sidebar-tab ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              title={tab.tooltip}
              aria-label={tab.label}
            >
              <IconComponent />
              {!isCollapsed && <span className="tab-label">{tab.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredTab === tab.id && (
                <div className="tab-tooltip">
                  {tab.tooltip}
                </div>
              )}
            </button>
          );
        })}

        {/* Settings Tab (Bottom) */}
        <div className="sidebar-tabs-bottom">
          <button
            className="sidebar-tab settings-tab"
            onClick={() => handleTabClick('settings')}
            title="Settings"
            aria-label="Settings"
          >
            <FiSettings />
            {!isCollapsed && <span className="tab-label">Settings</span>}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {!isCollapsed && activeTab && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3 className="sidebar-title">
              {sidebarTabs.find(tab => tab.id === activeTab)?.label || 'Sidebar'}
            </h3>
            <Button
              variant="ghost"
              size="small"
              onClick={onToggleCollapse}
              className="collapse-button"
              title="Collapse Sidebar"
            >
              <FiChevronLeft />
            </Button>
          </div>
          
          <div className="sidebar-body">
            {children || <SidebarPlaceholder activeTab={activeTab} />}
          </div>
        </div>
      )}

      {/* Expand Button (Collapsed State) */}
      {isCollapsed && (
        <button
          className="sidebar-expand"
          onClick={onToggleCollapse}
          title="Expand Sidebar"
          aria-label="Expand Sidebar"
        >
          <FiChevronRight />
        </button>
      )}
    </div>
  );
};

// Placeholder content for different tabs
const SidebarPlaceholder = ({ activeTab }) => {
  const placeholders = {
    explorer: {
      title: 'Explorer',
      content: 'File explorer content will appear here.',
      icon: FiFolder
    },
    terminal: {
      title: 'Terminal',
      content: 'Integrated terminal and command line.',
      icon: FiTerminal
    },
    settings: {
      title: 'Settings',
      content: 'IDE preferences and configuration.',
      icon: FiSettings
    }
  };

  const placeholder = placeholders[activeTab];
  
  if (!placeholder) return null;

  const IconComponent = placeholder.icon;

  return (
    <div className="sidebar-placeholder">
      <div className="placeholder-icon">
        <IconComponent />
      </div>
      <h4>{placeholder.title}</h4>
      <p>{placeholder.content}</p>
    </div>
  );
};

export default Sidebar;
