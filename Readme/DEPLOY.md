# 🚀 CipherStudio Deployment Guide

Complete step-by-step guide to deploy CipherStudio to production.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
6. [Environment Variables](#environment-variables)
7. [Testing Deployment](#testing-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Deployment Architecture

```
┌─────────────────────────────────────────────┐
│                                             │
│  Frontend (Vercel)                          │
│  https://cipherstudio.vercel.app            │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ API Calls
                   │
┌──────────────────▼──────────────────────────┐
│                                             │
│  Backend (Render)                           │
│  https://cipherstudio-api.onrender.com      │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ Database Queries
                   │
┌──────────────────▼──────────────────────────┐
│                                             │
│  MongoDB Atlas                              │
│  Cloud Database                             │
│                                             │
└─────────────────────────────────────────────┘
```

### What Goes Where?

- **Vercel** → Frontend (React app)
- **Render** → Backend (Node.js API)
- **MongoDB Atlas** → Database (cloud MongoDB)

---

## ✅ Prerequisites

Before deploying, make sure you have:

- [x] GitHub account
- [x] Vercel account (free tier)
- [x] Render account (free tier)
- [x] MongoDB Atlas account (free tier)
- [x] Code pushed to GitHub repository

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Click** "Try Free"
3. **Sign up** with Google/GitHub or email
4. **Verify** your email

### Step 2: Create a Cluster

1. **Click** "Build a Database"
2. **Select** "M0 Sandbox" (FREE tier)
   - Provider: AWS
   - Region: Choose closest to you
3. **Click** "Create"
4. **Wait** 3-5 minutes for cluster creation

### Step 3: Create Database User

1. **Security** → **Database Access**
2. **Click** "Add New Database User"
3. **Authentication Method:** Password
   - Username: `cipherstudio`
   - Password: Generate secure password (save it!)
4. **Database User Privileges:** Read and write to any database
5. **Click** "Add User"

### Step 4: Whitelist IP Addresses

1. **Security** → **Network Access**
2. **Click** "Add IP Address"
3. **Click** "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, use specific IPs
4. **Click** "Confirm"

### Step 5: Get Connection String

1. **Click** "Connect" on your cluster
2. **Choose** "Connect your application"
3. **Driver:** Node.js
4. **Version:** 4.1 or later
5. **Copy** connection string:
   ```
   mongodb+srv://cipherstudio:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace** `<password>` with your actual password
7. **Add** database name: `/cipherstudio` before the `?`
   ```
   mongodb+srv://cipherstudio:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cipherstudio?retryWrites=true&w=majority
   ```

**Save this connection string!** You'll need it for backend deployment.

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Create** `render.yaml` in backend folder (optional):
   ```yaml
   services:
     - type: web
       name: cipherstudio-api
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
   ```

2. **Update** `package.json` scripts:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

3. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Create Render Account

1. **Go to** [Render.com](https://render.com/)
2. **Click** "Get Started for Free"
3. **Sign up** with GitHub
4. **Authorize** Render to access your repositories

### Step 3: Create New Web Service

1. **Dashboard** → **New** → **Web Service**
2. **Connect** your GitHub repository
3. **Select** your CipherStudio repository

### Step 4: Configure Web Service

**Basic Settings:**
- **Name:** `cipherstudio-api`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- **Select:** Free (512 MB RAM, shared CPU)

### Step 5: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate random string (use password generator) |
| `JWT_EXPIRE` | `7d` |
| `CORS_ORIGIN` | `https://your-app.vercel.app` (add after Vercel deployment) |

**Generate JWT_SECRET:**
```bash
# In terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 6: Deploy

1. **Click** "Create Web Service"
2. **Wait** 5-10 minutes for deployment
3. **Check** logs for any errors
4. **Your API URL:** `https://cipherstudio-api.onrender.com`

### Step 7: Test Backend

Open in browser:
```
https://cipherstudio-api.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "message": "CipherStudio API is running",
  "timestamp": "2025-01-21T...",
  "environment": "production"
}
```

✅ **Backend deployed successfully!**

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Update** `package.json` (if needed):
   ```json
   {
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build",
       "test": "react-scripts test",
       "eject": "react-scripts eject"
     }
   }
   ```

2. **Create** `.env.production` in frontend folder:
   ```env
   REACT_APP_API_URL=https://cipherstudio-api.onrender.com
   ```

3. **Update** `src/services/api.js`:
   ```javascript
   import axios from 'axios';

   // API Base URL
   // Purpose: Use production URL in production, localhost in development
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

   const api = axios.create({
     baseURL: `${API_URL}/api`,
     headers: {
       'Content-Type': 'application/json'
     }
   });

   // ... rest of the file
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Configure for production"
   git push origin main
   ```

### Step 2: Create Vercel Account

1. **Go to** [Vercel.com](https://vercel.com/)
2. **Click** "Sign Up"
3. **Sign up** with GitHub
4. **Authorize** Vercel to access your repositories

### Step 3: Import Project

1. **Dashboard** → **Add New** → **Project**
2. **Import** your GitHub repository
3. **Select** your CipherStudio repository

### Step 4: Configure Project

**Framework Preset:**
- **Detected:** Create React App ✅

**Root Directory:**
- **Select:** `frontend`

**Build Settings:**
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `build` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 5: Add Environment Variables

Click "Environment Variables"

Add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://cipherstudio-api.onrender.com` |

### Step 6: Deploy

1. **Click** "Deploy"
2. **Wait** 2-5 minutes for build
3. **Your App URL:** `https://cipherstudio-xxx.vercel.app`

### Step 7: Update Backend CORS

1. **Go back to Render** dashboard
2. **Select** your backend service
3. **Environment** → **Edit**
4. **Update** `CORS_ORIGIN`:
   ```
   https://cipherstudio-xxx.vercel.app
   ```
5. **Save** → Service will redeploy

### Step 8: Test Frontend

1. **Open** `https://cipherstudio-xxx.vercel.app`
2. **Register** a new account
3. **Login**
4. **Create** a project
5. **Test** the IDE

✅ **Frontend deployed successfully!**

---

## 🔐 Environment Variables

### Backend (.env on Render)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cipherstudio

# Authentication
JWT_SECRET=your-super-secret-64-character-random-string
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://your-app.vercel.app
```

### Frontend (.env.production on Vercel)

```env
# API URL
REACT_APP_API_URL=https://cipherstudio-api.onrender.com
```

---

## 🧪 Testing Deployment

### Test Checklist

- [ ] Health check endpoint works
- [ ] User registration works
- [ ] User login works
- [ ] Create project works
- [ ] File creation works
- [ ] Code editor works
- [ ] Live preview works
- [ ] Auto-save works
- [ ] File deletion works
- [ ] Project deletion works
- [ ] Logout works

### Test Script

```bash
# Test backend health
curl https://cipherstudio-api.onrender.com/health

# Test registration (replace URL)
curl -X POST https://cipherstudio-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

---

## 🐛 Troubleshooting

### Backend Issues

#### **Error: MongoDB connection failed**
**Solution:**
1. Check MongoDB Atlas connection string
2. Verify database user password
3. Ensure IP whitelist includes 0.0.0.0/0
4. Check network access settings

#### **Error: JWT_SECRET not defined**
**Solution:**
1. Go to Render dashboard
2. Environment → Add `JWT_SECRET`
3. Generate secure random string
4. Save and redeploy

#### **Error: CORS policy error**
**Solution:**
1. Update `CORS_ORIGIN` in Render
2. Use exact Vercel URL (no trailing slash)
3. Redeploy backend

### Frontend Issues

#### **Error: API calls failing**
**Solution:**
1. Check `REACT_APP_API_URL` in Vercel
2. Ensure backend URL is correct
3. Check browser console for errors
4. Verify CORS settings

#### **Error: Build failed**
**Solution:**
1. Check build logs in Vercel
2. Ensure all dependencies in package.json
3. Fix any TypeScript/ESLint errors
4. Try building locally first

#### **Error: Environment variables not working**
**Solution:**
1. Prefix with `REACT_APP_`
2. Redeploy after adding variables
3. Clear browser cache
4. Check if using `process.env.REACT_APP_...`

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

**Vercel:**
- ✅ Automatically deploys on push to `main`
- ✅ Preview deployments for pull requests

**Render:**
- ✅ Automatically deploys on push to `main`
- ⚙️ Can configure deploy hooks

### Manual Deployment

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Render:**
- Dashboard → Manual Deploy → Deploy latest commit

---

## 📊 Monitoring

### Render Dashboard

- **Logs:** View real-time logs
- **Metrics:** CPU, Memory usage
- **Events:** Deployment history

### Vercel Dashboard

- **Analytics:** Page views, performance
- **Logs:** Function logs
- **Deployments:** Build history

---

## 💰 Cost Breakdown

### Free Tier Limits

**MongoDB Atlas (M0):**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ No credit card required

**Render (Free):**
- ✅ 512 MB RAM
- ✅ Shared CPU
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 750 hours/month

**Vercel (Hobby):**
- ✅ Unlimited websites
- ✅ 100 GB bandwidth/month
- ✅ Automatic SSL
- ✅ No credit card required

**Total Cost: $0/month** 🎉

---

## 🚀 Going to Production

### Recommended Upgrades

**For Production Use:**

1. **Render** → Upgrade to Starter ($7/month)
   - Always on (no spin down)
   - More RAM and CPU

2. **MongoDB Atlas** → Upgrade to M10 ($57/month)
   - Dedicated cluster
   - Automatic backups
   - Better performance

3. **Vercel** → Upgrade to Pro ($20/month)
   - More bandwidth
   - Advanced analytics
   - Team collaboration

---

## 📝 Post-Deployment Checklist

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic)
- [ ] Environment variables secured
- [ ] Database backups enabled
- [ ] Monitoring set up
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Documentation updated
- [ ] Team members invited
- [ ] Support email configured

---

## 🎉 Congratulations!

Your CipherStudio is now live! 🚀

**Frontend:** `https://your-app.vercel.app`  
**Backend:** `https://your-api.onrender.com`  
**Database:** MongoDB Atlas

---

## 📞 Support

**Issues?**
- Check logs in Render/Vercel dashboard
- Review environment variables
- Test API endpoints manually
- Check MongoDB Atlas connection

**Need Help?**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.atlas.mongodb.com

---

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [GitHub Repository](https://github.com/your-username/cipherstudio)

---

**Made with ❤️ by CipherStudio Team**

**Happy Deploying!** 🎊
