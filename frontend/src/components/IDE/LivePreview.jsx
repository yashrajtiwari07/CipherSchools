import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiExternalLink, FiMaximize2 } from 'react-icons/fi';
import Button from '../UI/Button';
import './IDE.css';

const LivePreview = ({ files, activeFile }) => {
  const [sandpackFiles, setSandpackFiles] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewMode, setPreviewMode] = useState('react'); // 'react' or 'html'
  const [htmlContent, setHtmlContent] = useState('');

  // Convert file structure to Sandpack format
  useEffect(() => {
    const fileMap = {};
    let htmlFile = null;
    
    // If we have an active file, prioritize it
    if (activeFile && activeFile.content !== undefined) {
      const activePath = buildFilePath(activeFile, files);
      fileMap[activePath] = {
        code: activeFile.content || '',
        active: true
      };
      
      if (activeFile.name.endsWith('.html')) {
        htmlFile = activeFile;
      }
    }
    
    // Add other files if they have content
    if (files && files.length > 0) {
      files.forEach(file => {
        if (file.type === 'file' && file.content !== undefined) {
          const path = buildFilePath(file, files);
          
          // Don't override active file
          if (!fileMap[path]) {
            fileMap[path] = {
              code: file.content || '',
              active: file._id === activeFile?._id
            };
          }
          
          // Check for HTML files
          if (file.name.endsWith('.html') && !htmlFile) {
            htmlFile = file;
          }
        }
      });
    }

    // Check if we have any React files
    const hasReactFiles = Object.keys(fileMap).some(path => 
      path.endsWith('.jsx') || path.endsWith('.tsx')
    );

    // Ensure we have required files for React if React files exist
    if (hasReactFiles) {
      if (!fileMap['/App.js'] && !fileMap['/App.jsx'] && !fileMap['/src/App.jsx']) {
        fileMap['/App.jsx'] = {
          code: `import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to CipherStudio</h1>
      <p>Start coding to see your live preview!</p>
    </div>
  );
}

export default App;`,
          active: true
        };
      }

      if (!fileMap['/index.js'] && !fileMap['/src/index.js']) {
        fileMap['/index.js'] = {
          code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
        };
      }
    }

    // Determine preview mode
    if (htmlFile && !hasReactFiles) {
      setPreviewMode('html');
      setHtmlContent(htmlFile.content || '<h1>Empty HTML file</h1>');
    } else {
      setPreviewMode('react');
    }

    setSandpackFiles(fileMap);
  }, [files, activeFile]);

  // Build file path from file structure
  const buildFilePath = (file, allFiles) => {
    const path = [];
    let currentFile = file;

    while (currentFile) {
      path.unshift(currentFile.name);
      
      if (currentFile.parentId) {
        currentFile = allFiles.find(f => f._id === currentFile.parentId);
      } else {
        break;
      }
    }

    return '/' + path.join('/');
  };

  // Refresh preview
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Generate React preview HTML
  const generateReactPreview = () => {
    if (Object.keys(sandpackFiles).length === 0) return '';

    // Get the main App component code
    const appFile = sandpackFiles['/App.jsx'] || sandpackFiles['/src/App.jsx'] || sandpackFiles['/App.js'];
    const cssFile = sandpackFiles['/App.css'] || sandpackFiles['/src/App.css'];
    
    if (!appFile) return '<div style="padding: 40px; text-align: center;"><h2>No App.jsx found</h2><p>Create an App.jsx file to see the preview</p></div>';

    let appCode = appFile.code || '';
    const cssCode = cssFile ? cssFile.code : '';

    // Remove ES6 import/export statements and replace with global React
    appCode = appCode
      .replace(/import\s+React\s*,?\s*\{?\s*useState\s*,?\s*useEffect\s*,?\s*\}?\s*from\s+['"]react['"];?/gi, 'const { useState, useEffect } = React;')
      .replace(/import\s+React\s*,?\s*\{([^}]+)\}\s*from\s+['"]react['"];?/gi, 'const { $1 } = React;')
      .replace(/import\s+React\s+from\s+['"]react['"];?/gi, '// React is available globally')
      .replace(/import\s+['"]\.\/App\.css['"];?/gi, '// CSS loaded separately')
      .replace(/export\s+default\s+/gi, '// ');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    #root { min-height: 100vh; }
    ${cssCode}
  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${appCode}
    
    // Render the App component
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
  <script>
    // Error handling
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.innerHTML = 
          '<div style="padding: 40px; color: #f44336; font-family: monospace; background: #fff3f3; border-left: 4px solid #f44336;">' +
          '<h2 style="margin-bottom: 16px;">⚠️ Error</h2>' +
          '<pre style="background: white; padding: 16px; border-radius: 4px; overflow-x: auto;">' + msg + '</pre>' +
          '<p style="margin-top: 16px; color: #666;">Line: ' + lineNo + '</p>' +
          '<p style="margin-top: 8px; color: #999; font-size: 0.9rem;">Fix the error in your code and it will update automatically.</p>' +
          '</div>';
      }
      return false;
    };
  </script>
</body>
</html>
    `;
  };

  if (Object.keys(sandpackFiles).length === 0) {
    return (
      <div className="live-preview-empty">
        <div className="empty-state">
          <h3>📺 Live Preview</h3>
          <p className="empty-main-text">Click on a file to see the preview</p>
          <div className="preview-features">
            <h4>Supported:</h4>
            <ul>
              <li>✅ HTML/CSS/JS files</li>
              <li>✅ React components (.jsx)</li>
              <li>✅ Real-time updates</li>
              <li>✅ Error boundaries</li>
            </ul>
          </div>
          <div className="preview-hint">
            <p>💡 <strong>Tip:</strong> Click on App.jsx in the Explorer to start!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`live-preview ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="preview-header">
        <h3>Live Preview</h3>
        <div className="preview-actions">
          <Button
            size="small"
            variant="ghost"
            onClick={handleRefresh}
            title="Refresh Preview"
          >
            <FiRefreshCw />
          </Button>
          <Button
            size="small"
            variant="ghost"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FiMaximize2 /> : <FiExternalLink />}
          </Button>
        </div>
      </div>

      <div className="preview-container">
        <iframe
          key={refreshKey}
          srcDoc={previewMode === 'html' ? htmlContent : generateReactPreview()}
          title="Live Preview"
          sandbox="allow-scripts"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: 'white'
          }}
        />
      </div>

      {isFullscreen && (
        <div className="fullscreen-overlay">
          <Button
            variant="ghost"
            onClick={toggleFullscreen}
            className="fullscreen-close"
          >
            Exit Fullscreen
          </Button>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
