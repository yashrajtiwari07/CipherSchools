import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { useFileSystem } from '../hooks/useFileSystem';
import FileExplorer from '../components/IDE/FileExplorer';
import CodeEditor from '../components/IDE/CodeEditor';
import LivePreview from '../components/IDE/LivePreview';
import StatusBar from '../components/IDE/StatusBar';
import Terminal from '../components/IDE/Terminal';
import SettingsPanel from '../components/IDE/SettingsPanel';
import Sidebar from '../components/Layout/Sidebar';
import Loader from '../components/UI/Loader';
import { debounce } from '../utils/helpers';
import './Pages.css';

const IDEWorkspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, loading: projectLoading, error: projectError } = useProject(projectId);
  const {
    files,
    activeFile,
    loadFiles,
    updateFileContent,
    setActiveFile,
    openFile,
    loading: filesLoading
  } = useFileSystem(projectId);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('explorer');
  const [lastSaved, setLastSaved] = useState(null);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [theme, setTheme] = useState(project?.settings?.theme || 'dark');

  // Load files when project loads
  useEffect(() => {
    if (project && projectId) {
      loadFiles();
    }
  }, [project, projectId, loadFiles]);

  // Debounced file content update
  const debouncedUpdateFile = debounce(async (content) => {
    if (activeFile && isAutoSave) {
      try {
        await updateFileContent(activeFile._id, content);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save file:', error);
      }
    }
  }, 1000);

  const handleFileSelect = async (file) => {
    if (file.type === 'file') {
      try {
        // Load file content from backend
        await openFile(file);
      } catch (error) {
        console.error('Failed to open file:', error);
      }
    }
  };

  const handleEditorChange = (content) => {
    if (activeFile) {
      // Update local state immediately
      setActiveFile(prev => ({
        ...prev,
        content
      }));
      
      // Debounced save to backend
      debouncedUpdateFile(content);
    }
  };

  const handleSidebarTabChange = (tabId) => {
    setActiveSidebarTab(prevTab => prevTab === tabId ? null : tabId);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    if (sidebarCollapsed) {
      setActiveSidebarTab('explorer');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // You can also save to backend here if needed
  };

  const handleAutoSaveToggle = () => {
    setIsAutoSave(!isAutoSave);
  };

  // Loading state
  if (projectLoading || filesLoading) {
    return (
      <div className="ide-loading">
        <Loader size="large" text="Loading workspace..." />
      </div>
    );
  }

  // Error state
  if (projectError) {
    return (
      <div className="ide-error">
        <div className="error-content">
          <h2>Failed to load project</h2>
          <p>{projectError}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Project not found
  if (!project) {
    return (
      <div className="ide-error">
        <div className="error-content">
          <h2>Project not found</h2>
          <p>The project you're looking for doesn't exist or you don't have access to it.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ide-workspace">
      <div className="ide-layout">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeSidebarTab}
          onTabChange={handleSidebarTabChange}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        >
          {activeSidebarTab === 'explorer' && (
            <FileExplorer
              projectId={projectId}
              onFileSelect={handleFileSelect}
              activeFileId={activeFile?._id}
            />
          )}
          {activeSidebarTab === 'terminal' && (
            <Terminal projectId={projectId} />
          )}
          {activeSidebarTab === 'settings' && (
            <SettingsPanel
              theme={theme}
              onThemeChange={handleThemeChange}
              isAutoSave={isAutoSave}
              onAutoSaveToggle={handleAutoSaveToggle}
              project={project}
            />
          )}
        </Sidebar>

        {/* Main Content */}
        <div className="ide-main">
          <div className="ide-panels">
            {/* Code Editor */}
            <div className="editor-panel">
              <CodeEditor
                file={activeFile}
                onChange={handleEditorChange}
                theme={theme}
              />
            </div>

            {/* Live Preview */}
            <div className="preview-panel">
              <LivePreview
                files={files}
                activeFile={activeFile}
              />
            </div>
          </div>

          {/* Status Bar */}
          <StatusBar
            project={project}
            activeFile={activeFile}
            fileCount={files.length}
            lastSaved={lastSaved}
            isAutoSave={isAutoSave}
          />
        </div>
      </div>
    </div>
  );
};

export default IDEWorkspace;
