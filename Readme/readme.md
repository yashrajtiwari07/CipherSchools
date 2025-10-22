# 🚀 CipherStudio - Full-Stack MERN React IDE

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/Node.js-18.x-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-6.0-brightgreen.svg" alt="MongoDB">
  <img src="https://img.shields.io/badge/Express.js-4.18-lightgrey.svg" alt="Express.js">
</p>

<p align="center">A comprehensive browser-based React IDE that allows users to write, execute, and save React projects directly in the browser using only MongoDB for data storage</p>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Complete Folder Structure](#-complete-folder-structure)
- [Frontend Components](#-frontend-components)
- [Backend Services](#-backend-services)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [File Storage Implementation](#-file-storage-implementation)
- [Development Workflow](#-development-workflow)

---

## 🎯 Project Overview

CipherStudio is a full-featured online React development environment built using the MERN stack with MongoDB as the sole storage solution. It provides developers with a complete IDE experience in the browser, featuring file management, code editing with Monaco Editor, live preview using Sandpack, and persistent project storage entirely within MongoDB.

### Core Features

- **📁 File Management System** - Create, delete, rename, and organize project files with hierarchical folder structure
- **✏️ Advanced Code Editor** - Monaco Editor with syntax highlighting, IntelliSense, and error detection
- **👁️ Live Preview** - Real-time React code execution and preview using Sandpack
- **💾 MongoDB Storage** - All file content stored directly in MongoDB collections
- **👤 User Authentication** - JWT-based authentication with registration and login
- **🌙 Theme Support** - Dark/Light mode with persistent user preferences
- **📱 Responsive Design** - Optimized for desktop and tablet devices
- **⚡ Auto-save** - Automatic project saving with manual toggle option

---

## 🧱 Tech Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend Framework** | React | 18.2.0 | UI Components & State Management |
| **Code Editor** | Monaco Editor | 0.41.0 | Rich code editing experience |
| **Code Execution** | Sandpack | 2.6.0 | Live React code preview |
| **Backend Runtime** | Node.js | 18.x | Server-side JavaScript runtime |
| **Web Framework** | Express.js | 4.18.0 | RESTful API development |
| **Database** | MongoDB Atlas | 6.0 | Document-based data & file storage |
| **Authentication** | JWT | 9.0.0 | Secure token-based auth |
| **File Handling** | Multer | 1.4.5 | File upload middleware |

---

## 📁 Complete Folder Structure

```
/project-root
├── /frontend                          # React Application (Port 3000)
│   ├── /public
│   │   ├── index.html                # HTML template
│   │   ├── favicon.ico               # App icon
│   │   └── manifest.json             # PWA configuration
│   │
│   ├── /src
│   │   ├── /components               # React Components
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx       # Navigation header
│   │   │   │   ├── Footer.jsx       # Footer component
│   │   │   │   └── Sidebar.jsx      # Navigation sidebar
│   │   │   │
│   │   │   ├── IDE/
│   │   │   │   ├── FileExplorer.jsx # File tree management
│   │   │   │   ├── CodeEditor.jsx   # Monaco Editor wrapper
│   │   │   │   ├── LivePreview.jsx  # Sandpack integration
│   │   │   │   └── StatusBar.jsx    # IDE status bar
│   │   │   │
│   │   │   ├── Project/
│   │   │   │   ├── ProjectCard.jsx  # Project display cards
│   │   │   │   ├── ProjectModal.jsx # Create/Edit modals
│   │   │   │   └── ProjectList.jsx  # Projects listing
│   │   │   │
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx        # User login form
│   │   │   │   ├── Register.jsx     # User registration
│   │   │   │   └── ProtectedRoute.jsx # Route protection
│   │   │   │
│   │   │   └── UI/
│   │   │       ├── Button.jsx       # Reusable button
│   │   │       ├── Modal.jsx        # Modal component
│   │   │       ├── Loader.jsx       # Loading spinner
│   │   │       └── ThemeToggle.jsx  # Theme switcher
│   │   │
│   │   ├── /hooks                    # Custom React Hooks
│   │   │   ├── useAuth.js           # Authentication hook
│   │   │   ├── useProject.js        # Project management
│   │   │   ├── useLocalStorage.js   # Local storage utility
│   │   │   └── useFileSystem.js     # File operations
│   │   │
│   │   ├── /services                 # API Service Layer
│   │   │   ├── api.js               # Axios configuration
│   │   │   ├── authService.js       # Authentication APIs
│   │   │   ├── projectService.js    # Project CRUD APIs
│   │   │   └── fileService.js       # File management APIs
│   │   │
│   │   ├── /utils                    # Utility Functions
│   │   │   ├── constants.js         # App constants
│   │   │   ├── helpers.js           # Helper functions
│   │   │   └── fileUtils.js         # File operations
│   │   │
│   │   ├── /styles                   # CSS Styles
│   │   │   ├── globals.css          # Global styles
│   │   │   ├── variables.css        # CSS variables
│   │   │   └── components.css       # Component styles
│   │   │
│   │   ├── App.jsx                   # Main App Component
│   │   └── index.js                  # React entry point
│   │
│   ├── package.json                  # Frontend dependencies
│   └── .gitignore                    # Git ignore rules
│
└── /backend                           # Node.js API Server (Port 5000)
    ├── /models                        # MongoDB Models
    │   ├── User.js                   # User schema & model
    │   ├── Project.js                # Project schema & model
    │   └── File.js                   # File schema & model
    │
    ├── /routes                        # Express Route Handlers
    │   ├── auth.js                   # Authentication routes
    │   ├── users.js                  # User management routes
    │   ├── projects.js               # Project CRUD routes
    │   └── files.js                  # File management routes
    │
    ├── /controllers                   # Business Logic Controllers
    │   ├── authController.js         # Auth business logic
    │   ├── userController.js         # User operations
    │   ├── projectController.js      # Project operations
    │   └── fileController.js         # File operations
    │
    ├── /services                      # Service Layer
    │   ├── authService.js            # Authentication services
    │   ├── userService.js            # User data services
    │   ├── projectService.js         # Project data services
    │   └── fileService.js            # MongoDB file operations
    │
    ├── /middleware                    # Express Middleware
    │   ├── auth.js                   # JWT authentication
    │   ├── cors.js                   # CORS configuration
    │   ├── validation.js             # Request validation
    │   └── errorHandler.js           # Error handling
    │
    ├── /config                        # Configuration Files
    │   ├── database.js               # MongoDB connection
    │   └── jwt.js                    # JWT configuration
    │
    ├── /utils                         # Backend Utilities
    │   ├── logger.js                 # Logging utility
    │   ├── validators.js             # Data validators
    │   └── constants.js              # Server constants
    │
    ├── server.js                      # Express server entry
    ├── package.json                   # Backend dependencies
    ├── .env.example                   # Environment template
    └── .gitignore                     # Git ignore rules
```

---

## 🎨 Frontend Components

### Core IDE Components

#### **FileExplorer.jsx**
- Displays hierarchical file tree structure stored in MongoDB
- Handles file/folder creation, deletion, renaming
- Drag-and-drop file organization
- Context menu for file operations
- Real-time synchronization with MongoDB

#### **CodeEditor.jsx**
- Monaco Editor integration with React
- Syntax highlighting for JavaScript, JSX, CSS, HTML
- IntelliSense and auto-completion
- Direct content saving to MongoDB
- File content loading from database

#### **LivePreview.jsx**
- Sandpack integration for React code execution
- Real-time preview updates from MongoDB-stored files
- Error boundary implementation
- Console output display

---

## 🔧 Backend Services

### Core Services

#### **fileService.js**
MongoDB file operations (no external storage)

```javascript
createFile(projectId, fileData, content)
getFileContent(fileId)
updateFileContent(fileId, content)
deleteFile(fileId)
getProjectFiles(projectId)
moveFile(fileId, newParentId)
```

#### **projectService.js**
Project CRUD operations

```javascript
createProject(userId, projectData)
getUserProjects(userId)
getProjectById(projectId)
updateProject(projectId, updates)
deleteProject(projectId)
```

---

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/register` | Create new user account | `{username, email, password}` | `{token, user}` |
| POST | `/login` | Authenticate user | `{email, password}` | `{token, user}` |
| POST | `/logout` | Logout user | `{userId}` | `{message}` |
| GET | `/profile` | Get user profile | Headers: `Authorization` | `{user}` |

### Project Routes (`/api/projects`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/` | Get user's projects | - | `{projects[]}` |
| POST | `/` | Create new project | `{name, description, framework}` | `{project}` |
| GET | `/:id` | Get project by ID | - | `{project, files[]}` |
| PUT | `/:id` | Update project | `{name, description, settings}` | `{project}` |
| DELETE | `/:id` | Delete project | - | `{message}` |

### File Routes (`/api/files`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/` | Create file/folder | `{projectId, name, type, parentId, content}` | `{file}` |
| GET | `/:id` | Get file with content | - | `{file, content}` |
| PUT | `/:id` | Update file content | `{content, language}` | `{file}` |
| DELETE | `/:id` | Delete file/folder | - | `{message}` |
| PUT | `/:id/rename` | Rename file/folder | `{newName}` | `{file}` |
| GET | `/project/:projectId` | Get project files | - | `{files[]}` |

---

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    fontSize: {
      type: Number,
      default: 14
    },
    autoSave: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Projects Collection

```javascript
{
  _id: ObjectId,
  projectSlug: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  rootFolderId: {
    type: ObjectId,
    ref: 'File',
    required: true
  },
  settings: {
    framework: {
      type: String,
      enum: ['react', 'vue', 'angular', 'vanilla'],
      default: 'react'
    },
    autoSave: {
      type: Boolean,
      default: true
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Files Collection (MongoDB-Only Storage)

```javascript
{
  _id: ObjectId,
  projectId: {
    type: ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  parentId: {
    type: ObjectId,
    ref: 'File',
    default: null,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true,
    index: true
  },
  // FILE CONTENT STORED DIRECTLY IN MONGODB
  content: {
    type: String,
    default: '',
    required: function() {
      return this.type === 'file';
    }
  },
  language: {
    type: String,
    enum: ['javascript', 'jsx', 'typescript', 'tsx', 'css', 'scss', 'html', 'json', 'markdown'],
    required: function() {
      return this.type === 'file';
    }
  },
  encoding: {
    type: String,
    default: 'utf8'
  },
  sizeInBytes: {
    type: Number,
    default: 0
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 🚀 Installation Guide

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn package manager
- MongoDB Atlas account
- Git

### Step-by-Step Installation

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/cipherstudio.git
cd cipherstudio
```

#### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.0",
    "joi": "^17.9.0"
  }
}
```

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "@codesandbox/sandpack-react": "^2.6.0",
    "@monaco-editor/react": "^4.5.0",
    "axios": "^1.4.0",
    "react-icons": "^4.10.0"
  }
}
```

---

## 🔧 Environment Variables

### Backend (.env)

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (MongoDB Only)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# File Storage Settings (MongoDB)
MAX_FILE_SIZE_MB=10
MAX_FILES_PER_PROJECT=100
```

### Frontend (.env)

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=CipherStudio
REACT_APP_VERSION=1.0.0
```

---

## 📖 File Storage Implementation

### MongoDB File Storage Strategy

Instead of using AWS S3, all file content is stored directly in MongoDB:

1. **Small Files** (< 16MB): Stored as strings in the `content` field
2. **Large Files**: Can use MongoDB GridFS if needed
3. **File Metadata**: Stored in the Files collection
4. **Performance**: Optimized with proper indexing and pagination

### File Operations

```javascript
// Create file with content
const newFile = await File.create({
  projectId,
  parentId,
  name: 'App.jsx',
  type: 'file',
  content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;',
  language: 'jsx',
  sizeInBytes: Buffer.byteLength(content, 'utf8')
});

// Update file content
await File.findByIdAndUpdate(fileId, {
  content: newContent,
  sizeInBytes: Buffer.byteLength(newContent, 'utf8'),
  updatedAt: new Date()
});

// Get file with content
const file = await File.findById(fileId).select('name content language type');
```

---

## 🔄 Development Workflow

### Running Development Servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

### Available Scripts

#### Backend
- `npm run dev` - Development with nodemon
- `npm start` - Production server
- `npm test` - Run test suite

#### Frontend
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

## 📧 Contact

For any questions or support, please reach out to the project maintainers.

---

**Note**: This implementation uses MongoDB as the sole storage solution, storing all file content directly in the database while maintaining the same functionality as the original design. The approach is suitable for small to medium-sized projects and provides simpler deployment without external storage dependencies.