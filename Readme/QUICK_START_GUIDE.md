# 🚀 CipherStudio - Quick Start Guide

## ⚡ **Get Started in 3 Steps**

### **Step 1: Start the Application**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

**You should see:**
- Backend: `🚀 CipherStudio API Server running on port 5000`
- Frontend: Opens browser at `http://localhost:3000`

---

### **Step 2: Register & Login**

1. **Register** (First time users)
   - Click "Create one here" on login page
   - Enter username, email, password
   - Click "Sign Up"
   - Automatically logged in ✅

2. **Login** (Returning users)
   - Enter email and password
   - Click "Sign In"
   - Redirects to Dashboard ✅

**Test Credentials:**
```
Email: test@example.com
Password: test123
```

---

### **Step 3: Create Your First Project**

1. Click **"Create New Project"** button
2. Fill in details:
   - **Name**: My First App
   - **Description**: Learning CipherStudio
   - **Framework**: Choose one:
     - 🔵 **React** - Modern UI with hooks
     - 🟢 **Vanilla JS** - Pure HTML/CSS/JS
     - 🟣 **Vue.js** - Progressive framework

3. Click **"Create Project"**
4. **Boom!** 🎉 Your IDE opens with template files

---

## 🎨 **What You Get with Each Template**

### **React Template** 🔵
```
src/
├── App.jsx       ← Interactive counter demo
├── App.css       ← Beautiful gradient styles
└── index.js      ← React entry point
```

**Features:**
- useState counter (+, -, Reset)
- Modern gradient background
- Quick start guide
- Ready to add components!

**Try This:**
```jsx
// In App.jsx, add a new state:
const [message, setMessage] = useState('Hello!');

// Add an input:
<input 
  value={message} 
  onChange={(e) => setMessage(e.target.value)} 
/>
<p>{message}</p>
```

---

### **Vanilla JS Template** 🟢
```
src/
├── index.html    ← Semantic HTML
├── styles.css    ← Modern CSS
└── script.js     ← Interactive JS
```

**Features:**
- Counter functionality
- Todo list (add/delete)
- Event listeners
- DOM manipulation

**Try This:**
```javascript
// In script.js, add a new feature:
document.querySelector('#myButton').addEventListener('click', () => {
  alert('Button clicked!');
});
```

---

### **Vue.js Template** 🟣
```
src/
├── App.vue       ← Single File Component
└── main.js       ← Vue initialization
```

**Features:**
- Reactive data binding
- v-model two-way binding
- Counter demo
- Scoped styles

**Try This:**
```vue
<!-- In App.vue, add new data: -->
<template>
  <input v-model="name" />
  <p>Hello, {{ name }}!</p>
</template>

<script>
export default {
  data() {
    return { name: 'World' }
  }
}
</script>
```

---

## 🎯 **IDE Features**

### **Left Sidebar**
- 📁 **Explorer** - File management
- 💻 **Terminal** - Run commands
- ⚙️ **Settings** - Theme, auto-save

### **Main Area**
- **Left Panel** - Monaco Code Editor
- **Right Panel** - Live Preview
- **Bottom** - Status Bar

### **Keyboard Shortcuts**
- `Ctrl + S` - Save file
- `Ctrl + N` - New file
- `Ctrl + F` - Find
- `Ctrl + `` ` - Toggle terminal

---

## 📝 **Common Tasks**

### **Create a New File**
1. Click 📄+ button in Explorer
2. Enter filename (e.g., `Button.jsx`)
3. Press Enter
4. Start coding!

### **Create a Folder**
1. Click 📁+ button in Explorer
2. Enter folder name (e.g., `components`)
3. Press Enter
4. Add files inside!

### **Rename File/Folder**
1. Hover over file/folder
2. Click ✏️ (edit icon)
3. Type new name
4. Press Enter

### **Delete File/Folder**
1. Hover over file/folder
2. Click 🗑️ (trash icon)
3. Confirm deletion

---

## 🎨 **Customize Your IDE**

### **Change Theme**
1. Click ⚙️ Settings in sidebar
2. Go to "Appearance"
3. Click "Light" or "Dark"
4. Theme changes instantly!

### **Toggle Auto-Save**
1. Click ⚙️ Settings
2. Go to "Editor"
3. Click toggle button
4. Enable/Disable auto-save

---

## 💡 **Pro Tips**

### **1. Use the Terminal**
```bash
# Click Terminal icon (💻)
$ help          # See available commands
$ ls            # List files
$ pwd           # Current directory
$ date          # Current date/time
$ echo Hello    # Print message
```

### **2. Live Preview**
- **HTML files** → Renders in iframe
- **React files** → Renders with Sandpack
- **Auto-detects** file type
- **Updates live** as you type!

### **3. File Organization**
```
Good Structure:
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── Card.jsx
├── utils/
│   └── helpers.js
├── App.jsx
└── index.js
```

### **4. Quick Edits**
- Files auto-save after 1 second
- No need to manually save
- Status bar shows "Last saved"
- Green indicator = saved ✅

---

## 🐛 **Troubleshooting**

### **Login Not Working?**
```javascript
// Clear browser storage
localStorage.clear();

// Refresh page
// Try registering again
```

### **Files Not Showing?**
```bash
# Check backend is running
cd backend
npm run dev

# Refresh browser
# Check browser console (F12)
```

### **Preview Not Working?**
1. Click on the file to load content
2. Wait 1-2 seconds for preview
3. Check if file has content
4. Try clicking refresh button

### **Code Not Saving?**
1. Check auto-save is enabled (Settings)
2. Look for save indicator in status bar
3. Try manual save (Ctrl + S)
4. Check backend logs for errors

---

## 🎓 **Learning Path**

### **Beginner**
1. ✅ Create project with Vanilla JS
2. ✅ Make a simple counter
3. ✅ Add a todo list
4. ✅ Style with CSS

### **Intermediate**
1. ✅ Create React project
2. ✅ Build components
3. ✅ Use useState hook
4. ✅ Add interactivity

### **Advanced**
1. ✅ Create Vue project
2. ✅ Use reactive data
3. ✅ Build complex apps
4. ✅ Deploy your project

---

## 📚 **Example Projects to Build**

### **1. Todo App**
- Add/delete tasks
- Mark as complete
- Filter by status
- Save to localStorage

### **2. Calculator**
- Basic operations
- Clear function
- Decimal support
- Keyboard input

### **3. Weather App**
- Fetch weather data
- Display temperature
- Show forecast
- Location search

### **4. Portfolio**
- About section
- Projects showcase
- Contact form
- Responsive design

---

## 🚀 **Ready to Build!**

You now have:
- ✅ Working authentication
- ✅ Rich framework templates
- ✅ Live code editor
- ✅ Real-time preview
- ✅ File management
- ✅ Terminal access
- ✅ Theme customization

**Start creating amazing projects!** 🎉

---

## 📞 **Need Help?**

1. Check `IDE_COMPLETE_DOCUMENTATION.md` for full docs
2. Check `LOGIN_AND_TEMPLATES_FIX.md` for fixes
3. Check browser console (F12) for errors
4. Check backend terminal for logs

**Happy Coding!** 💻✨
