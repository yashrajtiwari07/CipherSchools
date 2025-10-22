/**
 * Framework Templates
 * Purpose: Provides starter code for new projects
 * Used by: projectController.js (when creating new project)
 * Structure: { framework: { files: [ { name, type, content, language } ] } }
 */

const frameworkTemplates = {
  // React Template
  // Purpose: Single-file React starter with counter demo and inline styles
  react: {
    files: [
      {
        name: 'App.jsx', // Main React component file
        type: 'file',
        content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        🚀 Welcome to CipherStudio
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Start building your amazing React application!
      </p>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '15px',
        margin: '30px auto',
        maxWidth: '400px'
      }}>
        <h2>Counter Demo</h2>
        <p style={{ fontSize: '4rem', fontWeight: 'bold', margin: '20px 0' }}>
          {count}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => setCount(count - 1)}
            style={{
              padding: '12px 24px',
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '8px',
              background: 'white',
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            -
          </button>
          <button 
            onClick={() => setCount(0)}
            style={{
              padding: '12px 24px',
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '8px',
              background: 'white',
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reset
          </button>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              padding: '12px 24px',
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '8px',
              background: 'white',
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            +
          </button>
        </div>
      </div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        margin: '30px auto',
        maxWidth: '500px',
        textAlign: 'left'
      }}>
        <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>Quick Start:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', paddingLeft: '25px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>✓</span>
            Edit App.jsx to modify this page
          </li>
          <li style={{ padding: '8px 0', paddingLeft: '25px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>✓</span>
            Create new files with the + button
          </li>
          <li style={{ padding: '8px 0', paddingLeft: '25px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>✓</span>
            See changes live in preview!
          </li>
          <li style={{ padding: '8px 0', paddingLeft: '25px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>✓</span>
            Build something amazing!
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;`,
        language: 'jsx' // Language for syntax highlighting in editor
      }
    ]
  }
};

// Export templates
// Purpose: Make templates available to projectController
module.exports = frameworkTemplates;
