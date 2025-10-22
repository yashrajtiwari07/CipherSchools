import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiCode, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../UI/Button';
import './Layout.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="brand-link">
          <div className="brand">
            <FiCode className="brand-icon" />
            <span className="brand-text">CipherStudio</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">
                Projects
              </Link>
              <span className="user-name">Hi, {user?.username}</span>
              <Button
                variant="ghost"
                size="small"
                onClick={handleLogout}
              >
                <FiLogOut />
                Logout
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

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle mobile menu"
        >
          {showMobileMenu ? <FiX /> : <FiMenu />}
        </button>
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
                Projects
              </Link>
              <button 
                className="mobile-nav-link logout"
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
              >
                Logout
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

      {/* Click outside to close menu */}
      {showMobileMenu && (
        <div 
          className="menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
