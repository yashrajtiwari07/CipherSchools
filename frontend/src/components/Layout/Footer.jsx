import React from 'react';
import { FiGithub, FiTwitter, FiMail, FiHeart } from 'react-icons/fi';
import './Layout.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3>CipherStudio</h3>
            <p>A powerful browser-based React IDE for modern developers</p>
          </div>

          {/* Links Section */}
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#updates">Updates</a></li>
                <li><a href="#roadmap">Roadmap</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#tutorials">Tutorials</a></li>
                <li><a href="#examples">Examples</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Community</h4>
              <ul>
                <li><a href="#discord">Discord</a></li>
                <li><a href="#forums">Forums</a></li>
                <li><a href="#github">GitHub</a></li>
                <li><a href="#support">Support</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="footer-social">
          <div className="social-links">
            <a 
              href="https://github.com/cipherstudio" 
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a 
              href="https://twitter.com/cipherstudio" 
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FiTwitter />
            </a>
            <a 
              href="mailto:hello@cipherstudio.dev" 
              className="social-link"
              aria-label="Email"
            >
              <FiMail />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="footer-divider" />
          <div className="footer-copyright">
            <p>
              © {currentYear} CipherStudio. Made with{' '}
              <FiHeart className="heart-icon" /> by developers, for developers.
            </p>
            <p className="footer-tech">
              Built with React, Node.js, MongoDB • Powered by Monaco Editor & Sandpack
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
