# 🚀 CipherStudio - Browser-Based React IDE

A modern, simplified browser-based Integrated Development Environment (IDE) for React development. Built with MERN stack (MongoDB, Express.js, React, Node.js) to provide a seamless coding experience directly in your browser.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- 🎯 **Simplified UI/UX** - Clean, intuitive interface focused on essential development tools
- 💻 **Monaco Code Editor** - VS Code-like editing experience with syntax highlighting
- 📁 **File Explorer** - Hierarchical file management with folder/file operations
- 👀 **Live Preview** - Real-time preview of your React applications
- 🔐 **User Authentication** - Secure login/signup with JWT tokens
- 💾 **Project Management** - Create, edit, duplicate, and delete projects
- ☁️ **Cloud Storage** - All projects stored in MongoDB for persistent access

### Developer Experience
- 🔄 **Auto-save** - Automatic saving of code changes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Optimized for quick loading and smooth interactions
- 🎨 **Clean Architecture** - Well-structured codebase following best practices

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing and navigation
- **Monaco Editor** - Powerful code editor (VS Code editor)
- **Axios** - HTTP client for API communication
- **React Icons** - Beautiful SVG icons
- **CSS3** - Custom styling with modern CSS features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB ODM for data modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing for security

### DevOps & Tools
- **Helmet** - Security middleware for Express
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - API rate limiting for security
- **Joi** - Data validation library
- **Morgan** - HTTP request logger

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────┐    HTTP/REST     ┌─────────────────┐    Mongoose     ┌─────────────────┐
│                 │    API Calls     │                 │    ODM          │                 │
│   React SPA     │ ◄──────────────► │  Express.js     │ ◄─────────────► │   MongoDB       │
│   (Frontend)    │                  │   Backend       │                 │   Database      │
│                 │                  │                 │                 │                 │
└─────────────────┘                  └─────────────────┘                 └─────────────────┘
        │                                      │                                 │
        │                                      │                                 │
        ▼                                      ▼                                 ▼
┌─────────────────┐                  ┌─────────────────┐                 ┌─────────────────┐
│   Components:   │                  │   Features:     │                 │  Collections:   │
│                 │                  │                 │                 │                 │
│ • Auth Pages    │                  │ • JWT Auth      │                 │ • users         │
│ • Dashboard     │                  │ • User Mgmt     │                 │ • projects      │
│ • IDE Workspace │                  │ • Project CRUD  │                 │ • files         │
│ • Project Mgmt  │                  │ • File System   │                 │                 │
│ • File Explorer │                  │ • API Routes    │                 │                 │
│ • Code Editor   │                  │ • Validation    │                 │                 │
│ • Live Preview  │                  │ • Security      │                 │                 │
└─────────────────┘                  └─────────────────┘                 └─────────────────┘
```

### Application Flow

```
User Journey Flow:
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Landing │ →  │ Auth    │ →  │Dashboard│ →  │ IDE     │ →  │ Live    │
│ Page    │    │Login/   │    │Project  │    │Code     │    │Preview  │
│         │    │Signup   │    │List     │    │Editor   │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

## 📁 Project Structure

```
CipherStudio/
├── 📂 backend/                 # Node.js/Express Backend
│   ├── 📂 config/              # Configuration files
│   │   ├── database.js         # MongoDB connection setup
│   │   └── jwt.js              # JWT token utilities
│   ├── 📂 controllers/         # Business logic handlers
│   │   ├── authController.js   # Authentication logic
│   │   ├── projectController.js# Project management logic
│   │   ├── fileController.js   # File operations logic
│   │   └── userController.js   # User management logic
│   ├── 📂 middleware/          # Express middleware
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── cors.js             # CORS configuration
│   │   ├── validation.js       # Input validation schemas
│   │   └── errorHandler.js     # Global error handling
│   ├── 📂 models/              # MongoDB data models
│   │   ├── User.js             # User schema
│   │   ├── Project.js          # Project schema
│   │   └── File.js             # File schema
│   ├── 📂 routes/              # API route definitions
│   │   ├── auth.js             # Authentication routes
│   │   ├── projects.js         # Project CRUD routes
│   │   ├── files.js            # File management routes
│   │   └── users.js            # User management routes
│   ├── 📂 utils/               # Utility functions
│   │   ├── frameworkTemplates.js# Project templates
│   │   ├── sanitize.js         # Input sanitization
│   │   └── constants.js        # Application constants
│   ├── 📄 .env                 # Environment variables
│   ├── 📄 server.js            # Express server entry point
│   └── 📄 package.json         # Backend dependencies
│
├── 📂 frontend/                # React Frontend Application
│   ├── 📂 public/              # Static public assets
│   │   └── index.html          # HTML template
│   ├── 📂 src/                 # React source code
│   │   ├── 📂 components/      # Reusable React components
│   │   │   ├── 📂 Auth/        # Authentication components
│   │   │   │   ├── Login.jsx   # Login form component
│   │   │   │   ├── Register.jsx# Registration form
│   │   │   │   └── ProtectedRoute.jsx# Route protection
│   │   │   ├── 📂 Layout/      # Layout components
│   │   │   │   └── Header.jsx  # Navigation header
│   │   │   ├── 📂 Project/     # Project management components
│   │   │   │   ├── ProjectList.jsx    # Project grid view
│   │   │   │   ├── ProjectCard.jsx    # Individual project card
│   │   │   │   └── ProjectModal.jsx   # Create/edit project modal
│   │   │   ├── 📂 IDE/         # IDE workspace components
│   │   │   │   ├── FileExplorer.jsx   # File tree navigator
│   │   │   │   ├── CodeEditor.jsx     # Monaco code editor wrapper
│   │   │   │   └── LivePreview.jsx    # Real-time preview panel
│   │   │   └── 📂 UI/          # Common UI components
│   │   │       ├── Button.jsx  # Reusable button component
│   │   │       ├── Loader.jsx  # Loading spinner component
│   │   │       └── Modal.jsx   # Modal dialog component
│   │   ├── 📂 hooks/           # Custom React hooks
│   │   │   ├── useAuth.js      # Authentication state management
│   │   │   ├── useProject.js   # Project state management
│   │   │   └── useFileSystem.js# File system operations
│   │   ├── 📂 pages/           # Main page components
│   │   │   ├── Dashboard.jsx   # Main dashboard page
│   │   │   └── IDEWorkspace.jsx# IDE workspace page
│   │   ├── 📂 services/        # API service layers
│   │   │   ├── api.js          # Axios configuration & interceptors
│   │   │   ├── authService.js  # Authentication API calls
│   │   │   ├── projectService.js# Project management API calls
│   │   │   └── fileService.js  # File operations API calls
│   │   ├── 📂 styles/          # CSS stylesheets
│   │   │   └── components.css  # Component-specific styles
│   │   ├── 📂 utils/           # Utility functions
│   │   │   ├── constants.js    # Application constants
│   │   │   └── helpers.js      # Helper functions
│   │   ├── 📄 App.jsx          # Main React component with routing
│   │   └── 📄 index.js         # React app entry point
│   └── 📄 package.json         # Frontend dependencies
│
├── 📄 README.md                # Project documentation (this file)
└── 📄 .gitignore              # Git ignore configuration
```

## 📦 Installation

### Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (v5.0+ recommended)
- **npm** or **yarn** package manager
- **Git** for version control

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/cipherstudio.git
cd cipherstudio
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret
```

#### Environment Variables (.env)
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cipherstudio

# JWT Configuration  
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
# Create .env file for custom API URL if needed
```

#### Frontend Environment Variables (optional)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Database Setup
```bash
# Make sure MongoDB is running
# On Windows (if MongoDB installed as service):
net start MongoDB

# On macOS/Linux:
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 5: Start the Application

#### Option 1: Development Mode (Recommended)
```bash
# Terminal 1 - Start Backend Server
cd backend
npm run dev     # Uses nodemon for auto-restart

# Terminal 2 - Start Frontend Development Server  
cd frontend
npm start       # Starts React dev server
```

#### Option 2: Production Mode
```bash
# Start Backend
cd backend
npm start

# Build and serve Frontend
cd frontend
npm run build
# Serve the build folder with your preferred web server
```

## 🎯 Usage

### 1. User Registration & Authentication
1. Open your browser and navigate to `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Fill in username, email, and password
4. Login with your credentials

### 2. Creating Your First Project
1. After login, you'll see the dashboard with your projects
2. Click "New Project" button
3. Enter project name and description
4. Click "Create" to generate a new React project

### 3. Using the IDE
1. Click on any project card to open it in the IDE
2. **File Explorer** (Left Panel): Navigate and manage your project files
3. **Code Editor** (Center Panel): Edit your code with Monaco editor
4. **Live Preview** (Right Panel): See real-time preview of your React app

### 4. File Operations
- **Create File**: Right-click in file explorer → "New File"
- **Create Folder**: Right-click in file explorer → "New Folder"  
- **Edit File**: Click on any file to open it in the editor
- **Delete**: Right-click on file/folder → "Delete"

### 5. Project Management
- **Edit Project**: Click "Edit" on project card to modify name/description
- **Duplicate Project**: Click "Copy" to create a duplicate
- **Delete Project**: Click "Delete" to remove project permanently

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com", 
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"  
}
```

### Project Endpoints

#### GET /api/projects
Get all projects for authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "name": "My React App",
  "description": "A sample React application",
  "framework": "react"
}
```

#### GET /api/projects/:id
Get specific project by ID.

#### PUT /api/projects/:id
Update project details.

#### DELETE /api/projects/:id
Delete a project and all its files.

### File Endpoints

#### GET /api/files/project/:projectId
Get all files for a specific project.

#### POST /api/files
Create a new file or folder.

#### PUT /api/files/:id
Update file content.

#### DELETE /api/files/:id
Delete a file or folder.

## 📸 Screenshots

### Dashboard - Project Management
```
┌─────────────────────────────────────────────────────────────────┐
│  CipherStudio                                    [User] [Logout] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  My Projects (3 projects)                     [+ New Project]   │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ React App   │ │ Portfolio   │ │ Todo List   │              │
│  │ A sample    │ │ Personal    │ │ Simple todo │              │
│  │ React app   │ │ website     │ │ manager     │              │
│  │             │ │             │ │             │              │
│  │ React • 2d  │ │ React • 5d  │ │ React • 1w  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### IDE Workspace - Three Panel Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  CipherStudio - My React App                    [User] [Logout] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┬─────────────────────────┬─────────────────────┐ │
│ │File Explorer│    Code Editor          │    Live Preview     │ │
│ │             │                         │                     │ │
│ │📁 src       │ import React from 'react│ ┌─────────────────┐ │ │
│ │ 📄 App.jsx  │                         │ │                 │ │ │
│ │ 📄 index.js │ function App() {        │ │   React App     │ │ │
│ │ 📄 App.css  │   return (              │ │                 │ │ │
│ │             │     <div>               │ │   Hello World   │ │ │
│ │             │       <h1>Hello World</h1│ │                 │ │ │
│ │             │     </div>              │ │   Count: 0      │ │ │
│ │             │   );                    │ │                 │ │ │
│ │             │ }                       │ │  [+] [-]        │ │ │
│ │             │                         │ │                 │ │ │
│ │             │ export default App;     │ └─────────────────┘ │ │
│ └─────────────┴─────────────────────────┴─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🤝 Contributing

We welcome contributions to CipherStudio! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code Style
- **Frontend**: Use ESLint configuration provided
- **Backend**: Follow Node.js best practices
- **General**: Use meaningful variable names and add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor** - For providing the excellent code editing experience
- **React Team** - For the amazing React framework
- **Express.js** - For the robust backend framework
- **MongoDB** - For the flexible database solution
- **Open Source Community** - For all the amazing libraries and tools

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/cipherstudio/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/cipherstudio/wiki)
- **Email**: support@cipherstudio.com

---

## 🚀 Quick Start Summary

```bash
# 1. Clone and setup
git clone https://github.com/yashrajtiwari07/CipherSchools 
cd cipherstudio

# 2. Backend setup
cd backend && npm install && cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Frontend setup  
cd ../frontend && npm install

# 4. Start development servers
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm start

# 5. Open http://localhost:3000 in your browser
```

**Happy Coding with CipherStudio! 🎉**

---

*Built with ❤️ by the CipherStudio Team*
