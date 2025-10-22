# Assignment Answers

## Did you face any technical challenges?

**Yes, I faced these challenges:**

### 1. Live Preview Sandbox Not Working
- **Problem:** React CDN scripts weren't loading in the iframe
- **What I tried:**
  - Loading React, ReactDOM, and Babel from CDN
  - Using different sandbox attributes
  - Checking Content Security Policy settings
- **Solution:**
  - Removed the strict `sandbox` attribute from iframe
  - Used `sandbox="allow-scripts allow-same-origin"` to allow scripts
  - Added proper CDN links in the correct order (React → ReactDOM → Babel)
  - Made sure Babel transforms JSX before running it
  - Now the preview works - code runs and shows output!

### 2. CORS Error After Deployment
- Frontend couldn't talk to backend after deploying
- Fixed by adding Vercel URL to allowed origins in `cors.js`
- Redeployed backend on Render

### 3. Environment Variables Confusion
- Created `.env` file with `REACT_APP_API_URL`
- Added backend URL with `/api` at the end
- Now frontend connects to deployed backend correctly

---

## Which part did you enjoy the most?

**Adding comments to all the backend code**

I enjoyed:
- Understanding how JWT authentication works
- Learning how routes → controllers → services → database connect
- Figuring out what each middleware does
- Making the code easier to read
- Like solving a puzzle!

---

## Which part was the most challenging?

**Getting the Live Preview iframe to work**

The hardest part:
- CDN scripts kept getting blocked by browser security
- Had to figure out the right sandbox permissions
- Needed to load scripts in correct order
- Debugging why React wasn't rendering
- Finally got it working by relaxing sandbox restrictions
