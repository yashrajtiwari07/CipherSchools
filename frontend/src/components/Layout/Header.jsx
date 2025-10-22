import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiCode, FiUser, FiLogOut, FiSettings, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS, THEMES } from '../../utils/constants';
import Button from '../UI/Button';
import ThemeToggle from '../UI/ThemeToggle';
import './Layout.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, THEMES.DARK);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isIDEPage = location.pathname.startsWith('/project/');

  return (
    <header className={`app-header ${isIDEPage ? 'ide-mode' : ''}`}>
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-left">
          <Link to="/" className="brand-link">
            <div className="brand">
              <FiCode className="brand-icon" />
              <span className="brand-text">CipherStudio</span>
            </div>
          </Link>
          
          {isIDEPage && (
            <div className="ide-breadcrumb">
              <span className="breadcrumb-separator">/</span>
              <span className="current-project">IDE Workspace</span>
            </div>
          )}
        </div>

        {/* Navigation (Desktop) */}
        <nav className="header-nav desktop-nav">
          {isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/')}
              >
                My Projects
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="header-right">
          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          {/* User Menu (Authenticated) */}
          {isAuthenticated && user && (
            <div className="user-menu-container">
              <button
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
              >
                <div className="user-avatar">
                  <FiUser />
                </div>
                <span className="user-name">{user.username}</span>
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-header">
                    <div className="user-info">
                      <strong>{user.username}</strong>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="user-menu-divider" />
                  
                  <div className="user-menu-items">
                    <button className="user-menu-item">
                      <FiSettings />
                      <span>Settings</span>
                    </button>
                    
                    <button 
                      className="user-menu-item logout"
                      onClick={handleLogout}
                    >
                      <FiLogOut />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="mobile-nav">
          {isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <button 
                className="mobile-nav-link logout"
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      {/* Click outside to close menus */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          className="menu-overlay"
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
