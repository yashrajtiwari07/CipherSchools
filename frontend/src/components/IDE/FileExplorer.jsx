import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FiFolder,
  FiFolderPlus,
  FiFile,
  FiFilePlus,
  FiEdit3,
  FiTrash2,
  FiChevronRight,
  FiChevronDown
} from 'react-icons/fi';
import { useFileSystem } from '../../hooks/useFileSystem';
import { isValidFileName, getFileExtension } from '../../utils/fileUtils';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import './IDE.css';

// ✅ Local helper for file icons
const getFileIcon = (fileName) => {
  const ext = getFileExtension(fileName);
  switch (ext) {
    case 'js':
    case 'jsx':
      return <FiFile color="#f7df1e" title=".js" />;
    case 'html':
      return <FiFile color="#e34c26" title=".html" />;
    case 'css':
      return <FiFile color="#264de4" title=".css" />;
    case 'json':
      return <FiFile color="#7cc" title=".json" />;
    case 'txt':
      return <FiFile color="#999" title=".txt" />;
    default:
      return <FiFile />;
  }
};

const FileExplorer = ({ projectId, onFileSelect, activeFileId }) => {
  const {
    fileTree,
    loading,
    error,
    createFile,
    renameFile,
    deleteFile,
    fileExists
  } = useFileSystem(projectId);

  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('file');
  const [createParentId, setCreateParentId] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [newName, setNewName] = useState('');

  // ✅ Toggle folder expansion
  const toggleFolder = useCallback((folderId) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) newSet.delete(folderId);
      else newSet.add(folderId);
      return newSet;
    });
  }, []);

  // ✅ Handle file/folder creation
  const handleCreateFile = async (name, type, parentId = null) => {
    try {
      if (!isValidFileName(name)) {
        alert('Invalid file name. Please avoid special characters.');
        return;
      }

      if (fileExists(name, parentId)) {
        alert(`A ${type} with this name already exists.`);
        return;
      }

      const newFile = await createFile({
        name,
        type,
        parentId,
        content: type === 'file' ? '' : undefined
      });

      if (parentId) {
        setExpandedFolders((prev) => new Set([...prev, parentId]));
      }

      if (type === 'file') onFileSelect(newFile);

      setShowCreateModal(false);
      setNewName('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create file');
    }
  };

  // ✅ Handle file rename
  const handleRename = async (fileId, name) => {
    try {
      if (!isValidFileName(name)) {
        alert('Invalid file name. Please avoid special characters.');
        return;
      }
      await renameFile(fileId, name);
      setEditingFile(null);
      setNewName('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to rename file');
    }
  };

  // ✅ Handle file delete
  const handleDelete = async (fileId, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        await deleteFile(fileId);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete file');
      }
    }
  };

  // ✅ Start create modal
  const startCreate = (type, parentId = null) => {
    setCreateType(type);
    setCreateParentId(parentId);
    setShowCreateModal(true);
    setNewName('');
  };

  // ✅ Start rename
  const startEdit = (file) => {
    setEditingFile(file._id);
    setNewName(file.name);
  };

  // ✅ Render tree recursively
  const renderFileTree = (files, level = 0) =>
    files.map((file) => (
      <FileTreeItem
        key={file._id}
        file={file}
        level={level}
        isExpanded={expandedFolders.has(file._id)}
        isActive={file._id === activeFileId}
        isEditing={editingFile === file._id}
        editName={newName}
        onToggle={() => toggleFolder(file._id)}
        onSelect={() => file.type === 'file' && onFileSelect(file)}
        onCreateFile={() => startCreate('file', file._id)}
        onCreateFolder={() => startCreate('folder', file._id)}
        onEdit={() => startEdit(file)}
        onDelete={() => handleDelete(file._id, file.name)}
        onEditNameChange={setNewName}
        onEditSubmit={() => handleRename(file._id, newName)}
        onEditCancel={() => {
          setEditingFile(null);
          setNewName('');
        }}
      >
        {file.children &&
          expandedFolders.has(file._id) &&
          renderFileTree(file.children, level + 1)}
      </FileTreeItem>
    ));

  if (loading) {
    return (
      <div className="file-explorer loading">
        <div className="loading-spinner">Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-explorer error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <div className="explorer-actions">
          <Button
            size="small"
            variant="ghost"
            onClick={() => startCreate('file')}
            title="New File"
          >
            <FiFilePlus />
          </Button>
          <Button
            size="small"
            variant="ghost"
            onClick={() => startCreate('folder')}
            title="New Folder"
          >
            <FiFolderPlus />
          </Button>
        </div>
      </div>

      <div className="file-tree">
        {fileTree.length > 0 ? (
          renderFileTree(fileTree)
        ) : (
          <div className="empty-explorer">
            <p>No files yet</p>
            <Button size="small" onClick={() => startCreate('file')}>
              Create your first file
            </Button>
          </div>
        )}
      </div>

      {/* ✅ Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={`Create New ${createType === 'file' ? 'File' : 'Folder'}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateFile(newName, createType, createParentId);
          }}
        >
          <div className="form-group">
            <label htmlFor="fileName">
              {createType === 'file' ? 'File' : 'Folder'} Name
            </label>
            <input
              type="text"
              id="fileName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={
                createType === 'file' ? 'example.jsx' : 'folder-name'
              }
              autoFocus
              required
            />
          </div>
          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ✅ FileTreeItem Subcomponent
const FileTreeItem = ({
  file,
  level,
  isExpanded,
  isActive,
  isEditing,
  editName,
  onToggle,
  onSelect,
  onCreateFile,
  onCreateFolder,
  onEdit,
  onDelete,
  onEditNameChange,
  onEditSubmit,
  onEditCancel,
  children
}) => {
  const isFolder = file.type === 'folder';

  return (
    <div className="file-tree-item">
      <div
        className={`file-item ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {isFolder && (
          <button className="folder-toggle" onClick={onToggle}>
            {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        )}

        <div className="file-icon">
          {isFolder ? <FiFolder /> : getFileIcon(file.name)}
        </div>

        {isEditing ? (
          <input
            type="text"
            className="file-name-input"
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            onBlur={onEditCancel}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEditSubmit();
              if (e.key === 'Escape') onEditCancel();
            }}
            autoFocus
          />
        ) : (
          <span className="file-name" onClick={onSelect} title={file.name}>
            {file.name}
          </span>
        )}

        <div className="file-actions">
          {isFolder && (
            <>
              <button onClick={onCreateFile} title="New File">
                <FiFilePlus />
              </button>
              <button onClick={onCreateFolder} title="New Folder">
                <FiFolderPlus />
              </button>
            </>
          )}
          <button onClick={onEdit} title="Rename">
            <FiEdit3 />
          </button>
          <button onClick={onDelete} title="Delete">
            <FiTrash2 />
          </button>
        </div>
      </div>

      {isFolder && isExpanded && children}
    </div>
  );
};

FileExplorer.propTypes = {
  projectId: PropTypes.string.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  activeFileId: PropTypes.string
};

FileExplorer.defaultProps = {
  activeFileId: null
};

export default FileExplorer;
