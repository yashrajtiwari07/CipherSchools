export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const getFileIcon = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();

  const iconMap = {
    'js': '📄',
    'jsx': '⚛️',
    'ts': '🔷',
    'tsx': '🔷',
    'css': '🎨',
    'html': '🌐',
    'json': '📋',
    'md': '📝',
    'txt': '📄'
  };

  return iconMap[extension] || '📄';
};

// ✅ FIX ADDED BELOW
export const validateProjectName = (name) => {
  // Allow letters, numbers, spaces, hyphens, underscores
  const validPattern = /^[a-zA-Z0-9\s\-_]+$/;
  return validPattern.test(name);
};
