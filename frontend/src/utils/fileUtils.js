export const getFileExtension = (filename) => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const getLanguageFromExtension = (filename) => {
  const ext = getFileExtension(filename);
  
  const languageMap = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'css': 'css',
    'scss': 'scss',
    'html': 'html',
    'json': 'json',
    'md': 'markdown',
    'txt': 'text'
  };
  
  return languageMap[ext] || 'text';
};

export const isValidFileName = (filename) => {
  const invalidChars = /[<>:"/\\|?*]/;
  return !invalidChars.test(filename) && filename.trim().length > 0;
};

export const buildFileTree = (files) => {
  const fileMap = new Map();
  const tree = [];

  // Create a map of all files
  files.forEach(file => {
    fileMap.set(file._id, { ...file, children: [] });
  });

  // Build the tree structure
  files.forEach(file => {
    const fileNode = fileMap.get(file._id);
    
    if (file.parentId) {
      const parent = fileMap.get(file.parentId);
      if (parent) {
        parent.children.push(fileNode);
      }
    } else {
      tree.push(fileNode);
    }
  });

  // Sort children (folders first, then files)
  const sortChildren = (node) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortChildren);
    }
  };

  tree.forEach(sortChildren);
  return tree;
};

export const findFileInTree = (tree, fileId) => {
  for (const node of tree) {
    if (node._id === fileId) {
      return node;
    }
    if (node.children) {
      const found = findFileInTree(node.children, fileId);
      if (found) return found;
    }
  }
  return null;
};

// File size validation constants
export const MAX_FILE_SIZE = 102400; // 100KB in bytes

export const validateFileSize = (content) => {
  const sizeInBytes = new Blob([content]).size;
  
  if (sizeInBytes > MAX_FILE_SIZE) {
    throw new Error(`File size (${formatFileSize(sizeInBytes)}) exceeds maximum allowed size (${formatFileSize(MAX_FILE_SIZE)})`);
  }
  
  return true;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
