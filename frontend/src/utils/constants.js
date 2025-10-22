export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  TOKEN: 'cipherstudio_token',
  USER: 'cipherstudio_user',
  THEME: 'cipherstudio_theme',
  PROJECTS: 'cipherstudio_projects'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const FILE_TYPES = {
  JAVASCRIPT: 'javascript',
  JSX: 'jsx',
  TYPESCRIPT: 'typescript',
  TSX: 'tsx',
  CSS: 'css',
  HTML: 'html',
  JSON: 'json',
  MARKDOWN: 'markdown'
};

export const FRAMEWORK_OPTIONS = [
  { value: 'react', label: 'React', description: 'Modern UI library with hooks' }
];

export const DEFAULT_FILES = {
  react: {
    'App.jsx': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CipherStudio</h1>
        <p>Start building your amazing React application!</p>
      </header>
    </div>
  );
}

export default App;`,
    'App.css': `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  margin: 0 0 1rem 0;
}

p {
  font-size: 1.2rem;
}`,
    'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
  }
};
