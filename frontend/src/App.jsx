import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import IDEWorkspace from './pages/IDEWorkspace';
import Header from './components/Layout/Header';
import './styles/components.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app">
          <Header />
          <div className="app-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/project/:projectId" 
                element={
                  <ProtectedRoute>
                    <IDEWorkspace />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
