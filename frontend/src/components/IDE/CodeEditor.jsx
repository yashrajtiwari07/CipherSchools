import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { debounce } from '../../utils/helpers';
import { STORAGE_KEYS } from '../../utils/constants';
import './IDE.css';

const CodeEditor = ({ 
  file, 
  onChange, 
  theme = 'vs-dark',
  fontSize = 14,
  wordWrap = 'on',
  minimap = true 
}) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [savedTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'dark');

  // Debounce content changes to avoid too frequent API calls
  const debouncedOnChange = debounce((value) => {
    if (onChange && file) {
      onChange(value);
    }
  }, 500);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Configure editor settings
    editor.updateOptions({
      fontSize,
      wordWrap,
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      renderWhitespace: 'selection',
      renderControlCharacters: false,
      fontLigatures: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      mouseWheelZoom: true
    });

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Handle save (Ctrl+S)
      const content = editor.getValue();
      if (onChange && file) {
        onChange(content);
      }
    });

    // Add theme-specific configurations
    if (savedTheme === 'dark') {
      monaco.editor.setTheme('vs-dark');
    } else {
      monaco.editor.setTheme('vs-light');
    }

    // Focus editor
    editor.focus();
  };

  // Handle content change
  const handleEditorChange = (value) => {
    debouncedOnChange(value);
  };

  // Update editor theme when theme changes
  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      const monaco = window.monaco;
      if (monaco) {
        monaco.editor.setTheme(savedTheme === 'dark' ? 'vs-dark' : 'vs-light');
      }
    }
  }, [savedTheme, isEditorReady]);

  // Get language from file extension
  const getLanguage = (filename) => {
    if (!filename) return 'javascript';
    
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c'
    };
    
    return languageMap[ext] || 'plaintext';
  };

  if (!file) {
    return (
      <div className="code-editor-empty">
        <div className="empty-state">
          <h3>Welcome to CipherStudio</h3>
          <p>Select a file from the explorer to start editing</p>
          <div className="editor-features">
            <div className="feature">
              <strong>✨ Features:</strong>
            </div>
            <ul>
              <li>Monaco Editor (VS Code engine)</li>
              <li>Syntax highlighting</li>
              <li>IntelliSense & autocomplete</li>
              <li>Live error detection</li>
              <li>Code formatting</li>
              <li>Multiple themes</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="editor-tab">
          <span className="tab-icon">
            {file.name.endsWith('.jsx') ? '⚛️' : '📄'}
          </span>
          <span className="tab-name">{file.name}</span>
        </div>
        <div className="editor-info">
          <span className="file-language">
            {getLanguage(file.name).toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="editor-container">
        <Editor
          height="100%"
          language={getLanguage(file.name)}
          value={file.content || ''}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={savedTheme === 'dark' ? 'vs-dark' : 'vs-light'}
          loading={
            <div className="editor-loading">
              <div className="loading-spinner">Loading editor...</div>
            </div>
          }
          options={{
            selectOnLineNumbers: true,
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            contextmenu: true,
            mouseWheelScrollSensitivity: 1,
            fastScrollSensitivity: 5,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false
            }
          }}
        />
      </div>
      
      <div className="editor-footer">
        <div className="editor-stats">
          <span>Lines: {(file.content || '').split('\n').length}</span>
          <span>Characters: {(file.content || '').length}</span>
          <span>Size: {new Blob([file.content || '']).size} bytes</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
