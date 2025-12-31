# Deployment Guide - CampJam Flooring

## Current Issue
Your frontend is deployed on Vercel but trying to connect to `localhost:3001` (your local computer), which won't work in production.

## Solution: Deploy Your Backend

You need to deploy your backend server separately. Here are two options:

---

## Option 1: Deploy Backend to Vercel (Recommended - Free & Easy)

### Step 1: Create a New Vercel Project for Backend

1. Go to https://vercel.com/new
2. Import the **same repository** (campjamflooring)
3. Give it a different name: `campjam-flooring-api`
4. **IMPORTANT**: Set the Root Directory to `.` (current directory)

### Step 2: Configure Build Settings in Vercel

In the Vercel project settings:
- **Build Command**: Leave empty or use `npm install`
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### Step 3: Add Environment Variables to Backend Project

In your **backend Vercel project** settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://devappuser2025_db_user:HDNAVx68ibtFJ93093@cluster0.shxecyl.mongodb.net/campjam_flooring?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=dcorl7alb
CLOUDINARY_API_KEY=461412626479921
CLOUDINARY_API_SECRET=bWEilll6lXhVU7qmVSQ4uIe4P3g
```

### Step 4: Deploy Backend

Click "Deploy" in Vercel. Once deployed, you'll get a URL like:
`https://campjam-flooring-api.vercel.app`

### Step 5: Update Frontend Environment Variable

In your **frontend Vercel project** (https://campjamflooring.vercel.app):

1. Go to Settings → Environment Variables
2. Add a new variable:
   ```
   VITE_API_URL=https://campjam-flooring-api.vercel.app/api
   ```
3. **Redeploy** your frontend for the changes to take effect

---

## Option 2: Deploy Backend to Render.com (Alternative - Free Tier Available)

### Step 1: Create Account on Render
Go to https://render.com and sign up

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: campjam-flooring-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server:prod`
   - **Instance Type**: Free

### Step 3: Add Environment Variables
Add the same environment variables as Option 1

### Step 4: Update Frontend
Add `VITE_API_URL` with your Render backend URL to frontend Vercel project

---

## Testing After Deployment

1. Visit your backend URL + `/api/health`
   - Example: `https://campjam-flooring-api.vercel.app/api/health`
   - Should show: `{"status":"ok","message":"Server is running"}`

2. Visit your frontend: `https://campjamflooring.vercel.app`
   - Projects and reviews should now load

---

## Quick Reference

### Frontend (Already Deployed)
- URL: https://campjamflooring.vercel.app
- Needs: `VITE_API_URL` environment variable

### Backend (Needs Deployment)
- Current: localhost:3001 (only works on your computer)
- Needs: Deployment to Vercel or Render
- Required env vars: MONGODB_URI, JWT_SECRET, NODE_ENV, Cloudinary credentials

---

## Need Help?

If you get stuck, the key error message to look for is:
- ❌ "Access to XMLHttpRequest blocked by CORS" = Backend not deployed
- ✅ Projects and reviews loading = Everything working!
