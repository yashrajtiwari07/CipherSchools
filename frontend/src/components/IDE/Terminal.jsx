import React, { useState, useRef, useEffect } from 'react';
import { FiTerminal, FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import './IDE.css';

const Terminal = ({ projectId }) => {
  const [output, setOutput] = useState([
    { type: 'system', text: 'Welcome to CipherStudio Terminal' },
    { type: 'system', text: `Project ID: ${projectId}` },
    { type: 'system', text: 'Type "help" for available commands' },
    { type: 'prompt', text: '$ ' }
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when output changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const commands = {
    help: () => [
      { type: 'output', text: 'Available commands:' },
      { type: 'output', text: '  help     - Show this help message' },
      { type: 'output', text: '  clear    - Clear terminal' },
      { type: 'output', text: '  ls       - List files' },
      { type: 'output', text: '  pwd      - Print working directory' },
      { type: 'output', text: '  date     - Show current date/time' },
      { type: 'output', text: '  echo     - Echo text' },
      { type: 'output', text: '  whoami   - Show current user' }
    ],
    clear: () => {
      setOutput([{ type: 'prompt', text: '$ ' }]);
      return [];
    },
    ls: () => [
      { type: 'output', text: 'src/' },
      { type: 'output', text: 'components/' },
      { type: 'output', text: 'utils/' },
      { type: 'output', text: 'App.jsx' },
      { type: 'output', text: 'index.js' }
    ],
    pwd: () => [
      { type: 'output', text: `/projects/${projectId}` }
    ],
    date: () => [
      { type: 'output', text: new Date().toString() }
    ],
    whoami: () => [
      { type: 'output', text: 'cipherstudio-user' }
    ],
    echo: (args) => [
      { type: 'output', text: args.join(' ') }
    ]
  };

  const executeCommand = (cmd) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === 'clear') {
      commands.clear();
      return;
    }

    // Add command to output
    setOutput(prev => [
      ...prev,
      { type: 'command', text: `$ ${cmd}` }
    ]);

    // Execute command
    if (commands[command]) {
      const result = commands[command](args);
      setOutput(prev => [
        ...prev,
        ...result,
        { type: 'prompt', text: '$ ' }
      ]);
    } else {
      setOutput(prev => [
        ...prev,
        { type: 'error', text: `Command not found: ${command}` },
        { type: 'prompt', text: '$ ' }
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add to history
    setHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    // Execute command
    executeCommand(input);

    // Clear input
    setInput('');
  };

  const handleKeyDown = (e) => {
    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
    // Arrow down - next command
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`terminal-container ${isMaximized ? 'maximized' : ''}`}>
      <div className="terminal-header">
        <div className="terminal-title">
          <FiTerminal />
          <span>Terminal</span>
        </div>
        <div className="terminal-actions">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Minimize' : 'Maximize'}
            className="terminal-action-btn"
          >
            {isMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
          <button
            onClick={() => commands.clear()}
            title="Clear"
            className="terminal-action-btn"
          >
            <FiX />
          </button>
        </div>
      </div>

      <div 
        className="terminal-body" 
        ref={terminalRef}
        onClick={handleTerminalClick}
      >
        {output.map((line, index) => (
          <div key={index} className={`terminal-line terminal-${line.type}`}>
            {line.text}
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
