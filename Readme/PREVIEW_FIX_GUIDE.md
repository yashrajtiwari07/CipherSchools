# 🔧 Live Preview Fix Guide

## ❌ **Problem: Preview Not Working**

You're seeing an empty preview panel even though you have files open in the editor.

---

## ✅ **Solution: Follow These Steps**

### **Step 1: Make Sure File is Loaded**

The preview needs the file **content** to be loaded. Here's how:

1. **Click on the file** in Explorer (e.g., App.jsx)
2. **Wait 1-2 seconds** for content to load
3. **Check if code appears** in the editor
4. **Preview should update** automatically

**Why?** Files are loaded in two stages:
- First: Metadata only (name, type, id)
- Second: Content loaded when you click

---

### **Step 2: Verify File Has Content**

**Check in Editor:**
- You should see code in the Monaco editor
- If editor is empty, file has no content yet

**Fix Empty Files:**
1. Type some code in the editor
2. Wait 1 second (auto-save)
3. Preview should update

**Example React Code:**
```jsx
import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}

export default App;
```

---

### **Step 3: Check File Requirements**

#### **For React Projects:**
You need these files:
- ✅ `App.jsx` or `App.js`
- ✅ `index.js`
- ✅ (Optional) `App.css`

**Missing index.js?** Create it:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

#### **For HTML Projects:**
You need:
- ✅ `index.html` with content

**Example:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>
```

---

### **Step 4: Refresh Preview**

1. Click the **refresh button** (🔄) in preview header
2. Or edit the file to trigger update
3. Or close and reopen the file

---

### **Step 5: Check Browser Console**

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for errors (red text)
4. Common errors:
   - "Cannot find module" → Missing import
   - "Unexpected token" → Syntax error
   - "Network error" → Backend not running

---

## 🔍 **Debugging Steps**

### **1. Check if Backend is Running**
```bash
# Terminal should show:
🚀 CipherStudio API Server running on port 5000
📊 MongoDB Connected
```

If not running:
```bash
cd backend
npm run dev
```

---

### **2. Check File Content in Network Tab**

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click on a file in Explorer
4. Look for request: `GET /api/files/:id`
5. Check response has `content` field

**Example Response:**
```json
{
  "success": true,
  "file": {
    "_id": "...",
    "name": "App.jsx",
    "content": "import React...",  ← Should have content
    "language": "jsx"
  }
}
```

---

### **3. Check Files Array**

In browser console, type:
```javascript
// This will show all files
console.log('Files:', window.__files__);
```

Files should have `content` property when loaded.

---

### **4. Force Reload Files**

1. Refresh the browser page (F5)
2. Navigate back to project
3. Click on files again
4. Preview should work

---

## 🎯 **Common Issues & Solutions**

### **Issue 1: "No files yet" in Preview**

**Cause:** Files not loaded or no content

**Solution:**
1. Click on App.jsx in Explorer
2. Wait for content to load
3. Check editor shows code
4. Preview updates automatically

---

### **Issue 2: "Cannot find module './App'"**

**Cause:** Missing App.jsx file

**Solution:**
1. Create `App.jsx` file
2. Add React component code
3. Make sure it exports default

```jsx
export default App;  ← Must have this!
```

---

### **Issue 3: Preview Shows Error**

**Cause:** Syntax error in code

**Solution:**
1. Check editor for red underlines
2. Fix syntax errors
3. Save file (auto-save after 1 sec)
4. Preview updates

---

### **Issue 4: Preview is Blank (No Error)**

**Cause:** Component not rendering anything

**Solution:**
```jsx
// Make sure you return JSX
function App() {
  return (  ← Must return something
    <div>
      <h1>Content here</h1>
    </div>
  );
}
```

---

### **Issue 5: HTML Preview Not Working**

**Cause:** Wrong file type or no content

**Solution:**
1. Make sure file is named `index.html`
2. Add proper HTML structure
3. Include `<!DOCTYPE html>`
4. Preview should show in iframe

---

## 🚀 **Quick Test**

### **Test React Preview:**

1. **Create new React project**
2. **Click on App.jsx**
3. **Paste this code:**
```jsx
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Click Me!
      </button>
    </div>
  );
}

export default App;
```

4. **Wait 1 second** (auto-save)
5. **Preview should show** counter with button
6. **Success!** ✅

---

### **Test HTML Preview:**

1. **Create new Vanilla JS project**
2. **Click on index.html**
3. **Paste this code:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
    <style>
        body {
            font-family: Arial;
            padding: 40px;
            text-align: center;
        }
        h1 { color: #667eea; }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
    <p>If you see this, preview is working!</p>
</body>
</html>
```

4. **Wait 1 second**
5. **Preview should show** styled content
6. **Success!** ✅

---

## 📊 **How Preview Works**

### **React Mode:**
```
1. You click App.jsx
   ↓
2. Content loads from backend
   ↓
3. LivePreview detects .jsx file
   ↓
4. Uses Sandpack to render
   ↓
5. Shows in preview panel
```

### **HTML Mode:**
```
1. You click index.html
   ↓
2. Content loads from backend
   ↓
3. LivePreview detects .html file
   ↓
4. Renders in iframe
   ↓
5. Shows in preview panel
```

---

## 🔧 **Advanced Debugging**

### **Check LivePreview Component State:**

In browser console:
```javascript
// Check if files have content
console.log('Active File:', activeFile);
console.log('Has Content:', activeFile?.content);

// Check Sandpack files
console.log('Sandpack Files:', sandpackFiles);
```

### **Check useFileSystem Hook:**

```javascript
// In browser console
console.log('Files Array:', files);
console.log('Files with content:', files.filter(f => f.content));
```

---

## ✅ **Checklist**

Before asking for help, verify:

- [ ] Backend is running (`npm run dev`)
- [ ] MongoDB is connected
- [ ] File is clicked in Explorer
- [ ] Code appears in editor
- [ ] File has content (not empty)
- [ ] No errors in browser console
- [ ] Auto-save is enabled (Settings)
- [ ] Waited 1-2 seconds after editing

---

## 🎉 **Still Not Working?**

### **Nuclear Option: Fresh Start**

1. **Clear everything:**
```javascript
localStorage.clear();
```

2. **Refresh browser** (F5)

3. **Restart backend:**
```bash
cd backend
npm run dev
```

4. **Login again**

5. **Create NEW project**

6. **Click on App.jsx**

7. **Should work!** ✅

---

## 📝 **Summary**

**Main Issue:** Preview needs file **content** to be loaded

**Solution:** Click on file → Wait → Content loads → Preview works

**Key Points:**
- ✅ Files load in two stages (metadata, then content)
- ✅ Click file to load content
- ✅ Wait 1-2 seconds
- ✅ Check editor has code
- ✅ Preview updates automatically

**Your preview should now work!** 🎉
