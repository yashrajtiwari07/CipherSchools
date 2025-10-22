# Live Preview System - How It Works

## Overview
The Live Preview now supports **both HTML and React** files with automatic detection and rendering.

---

## 🔄 How It Works

### 1. **File Loading Process**

```
User clicks file → handleFileSelect() → openFile() → Loads content from backend → Updates activeFile
```

**Before (Broken):**
```javascript
const handleFileSelect = (file) => {
  setActiveFile(file); // ❌ File has no content property
};
```

**After (Fixed):**
```javascript
const handleFileSelect = async (file) => {
  await openFile(file); // ✅ Loads content from backend
};
```

### 2. **Preview Mode Detection**

The LivePreview component automatically detects what type of files you have:

```javascript
// Check for HTML files
if (file.name.endsWith('.html')) {
  htmlFile = file;
}

// Check for React files
const hasReactFiles = Object.keys(fileMap).some(path => 
  path.endsWith('.jsx') || path.endsWith('.tsx')
);

// Determine mode
if (htmlFile && !hasReactFiles) {
  setPreviewMode('html');  // Use iframe
} else {
  setPreviewMode('react'); // Use Sandpack
}
```

### 3. **Rendering Modes**

#### **HTML Mode** (for .html files)
```javascript
<iframe
  srcDoc={htmlContent}
  sandbox="allow-scripts allow-same-origin"
  style={{ width: '100%', height: '100%' }}
/>
```
- Renders plain HTML directly in iframe
- Supports inline CSS and JavaScript
- Isolated from parent page for security

#### **React Mode** (for .jsx/.tsx files)
```javascript
<Sandpack
  template="react"
  files={sandpackFiles}
  options={{ autorun: true }}
/>
```
- Uses CodeSandbox Sandpack
- Full React environment
- Hot reload on changes
- Error boundaries

---

## 📁 File Structure Examples

### Example 1: HTML Project
```
src/
  └── index.html  ← Will render in iframe
```

### Example 2: React Project
```
src/
  ├── App.jsx     ← Will render in Sandpack
  ├── index.js
  └── App.css
```

### Example 3: Mixed (React takes priority)
```
src/
  ├── index.html  ← Ignored
  └── App.jsx     ← Will render in Sandpack
```

---

## 🔧 Technical Details

### File Content Loading

Files are loaded in two stages:

1. **Initial Load** - Gets file metadata (name, type, id)
   ```javascript
   const files = await fileService.getProjectFiles(projectId);
   // Returns: [{ _id, name, type, parentId }]
   ```

2. **Content Load** - Gets actual file content when opened
   ```javascript
   const fileWithContent = await fileService.getFile(fileId);
   // Returns: { _id, name, type, content, language }
   ```

### Why Two Stages?

- **Performance**: Loading all file contents upfront would be slow
- **Memory**: Large projects could have many files
- **Efficiency**: Only load what the user needs

### File Tree Building

```javascript
buildFileTree(flatFiles) → nestedTree

// Input (flat):
[
  { _id: '1', name: 'src', parentId: null },
  { _id: '2', name: 'App.jsx', parentId: '1' }
]

// Output (nested):
[
  {
    _id: '1',
    name: 'src',
    children: [
      { _id: '2', name: 'App.jsx', children: [] }
    ]
  }
]
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Preview is blank"
**Cause**: File content not loaded
**Solution**: Click on the file to load its content

### Issue 2: "HTML not rendering"
**Cause**: React files present (React mode takes priority)
**Solution**: Remove .jsx files or use separate project

### Issue 3: "React errors in console"
**Cause**: Missing App.jsx or index.js
**Solution**: Component auto-creates default files

### Issue 4: "Changes not reflecting"
**Cause**: Auto-save delay (1 second)
**Solution**: Wait 1 second or click refresh button

---

## 🎯 User Flow

```
1. User opens project
   ↓
2. Files load (metadata only)
   ↓
3. File explorer shows files
   ↓
4. User clicks on file
   ↓
5. File content loads from backend
   ↓
6. Preview detects file type
   ↓
7. Renders in appropriate mode
   ↓
8. User edits file
   ↓
9. Auto-save after 1 second
   ↓
10. Preview updates automatically
```

---

## 🚀 Features

### HTML Preview
- ✅ Instant rendering
- ✅ Inline CSS support
- ✅ Inline JavaScript support
- ✅ Sandboxed for security
- ✅ Refresh button

### React Preview
- ✅ Full React environment
- ✅ Hot module replacement
- ✅ Error boundaries
- ✅ Console output
- ✅ Auto-reload
- ✅ Syntax highlighting

---

## 📝 Files Modified

1. **`frontend/src/components/IDE/LivePreview.jsx`**
   - Added HTML preview mode
   - Added iframe rendering
   - Auto-detection logic
   - Dual-mode support

2. **`frontend/src/pages/IDEWorkspace.jsx`**
   - Fixed file content loading
   - Added openFile() call
   - Proper async handling

3. **`frontend/src/hooks/useFileSystem.js`**
   - Fixed file tree building
   - Proper state updates
   - Content loading logic

---

## 🔐 Security

### HTML Preview Sandbox
```javascript
sandbox="allow-scripts allow-same-origin"
```

**Allows:**
- JavaScript execution
- Same-origin requests

**Blocks:**
- Form submissions
- Pop-ups
- Top navigation
- Downloads

---

**Fixed:** October 20, 2025  
**Issue:** Live preview not rendering files  
**Solution:** Added file content loading + HTML/React dual-mode support
