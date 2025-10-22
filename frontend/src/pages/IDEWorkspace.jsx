import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { useFileSystem } from '../hooks/useFileSystem';
import FileExplorer from '../components/IDE/FileExplorer';
import CodeEditor from '../components/IDE/CodeEditor';
import LivePreview from '../components/IDE/LivePreview';
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

  const [lastSaved, setLastSaved] = useState(null);
  const [isAutoSave, setIsAutoSave] = useState(true);

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
        {/* File Explorer */}
        <div className="file-explorer-panel">
          <div className="panel-header">
            <h3>Files</h3>
          </div>
          <FileExplorer
            projectId={projectId}
            onFileSelect={handleFileSelect}
            activeFileId={activeFile?._id}
          />
        </div>

        {/* Editor and Preview */}
        <div className="ide-main">
          <div className="ide-panels">
            {/* Code Editor */}
            <div className="editor-panel">
              <div className="panel-header">
                <h3>{activeFile ? activeFile.name : 'Select a file'}</h3>
              </div>
              <CodeEditor
                file={activeFile}
                onChange={handleEditorChange}
              />
            </div>

            {/* Live Preview */}
            <div className="preview-panel">
              <div className="panel-header">
                <h3>Preview</h3>
              </div>
              <LivePreview
                files={files}
                activeFile={activeFile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDEWorkspace;
