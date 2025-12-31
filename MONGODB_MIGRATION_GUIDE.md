# MongoDB Migration Guide

## Overview

Your CampJam Flooring application has been migrated from Supabase to MongoDB with a custom Express.js backend. This guide explains what was changed and how to use the new system.

## What Changed

### Backend (NEW)
- **Database**: MongoDB Atlas (replacing Supabase PostgreSQL)
- **Authentication**: JWT + bcrypt (replacing Supabase Auth)
- **File Storage**: Local filesystem (replacing Supabase Storage)
- **API Server**: Express.js on port 5000

### Frontend (MODIFIED - Next Steps)
- Frontend components need to be updated to use the new API
- See "Next Steps" section below

---

## Project Structure

```
campjamflooring/
├── server/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts               # JWT authentication middleware
│   ├── models/
│   │   ├── User.ts               # Admin user model
│   │   ├── GalleryProject.ts    # Gallery projects model
│   │   └── Review.ts             # Customer reviews model
│   ├── routes/
│   │   ├── auth.ts               # Authentication endpoints
│   │   ├── gallery.ts            # Gallery CRUD endpoints
│   │   ├── reviews.ts            # Reviews CRUD endpoints
│   │   └── upload.ts             # Image upload endpoints
│   ├── scripts/
│   │   └── seedAdmin.ts          # Script to create admin user
│   └── index.ts                  # Express server entry point
├── src/
│   └── lib/
│       └── api.ts                # Frontend API client (NEW)
├── public/
│   └── uploads/                  # Image storage directory
├── .env                          # Environment variables
└── package.json
```

---

## Environment Variables

Your `.env` file contains:

```
MONGODB_URI=mongodb+srv://devappuser2025_db_user:HDNAVx68ibtFJ93093@cluster0.shxecyl.mongodb.net/campjam_flooring?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
PORT=5000
NODE_ENV=development
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` to a secure random string in production!

---

## Database Models

### 1. User (Admin Users)
```typescript
{
  email: string (unique)
  password: string (hashed with bcrypt)
  isActive: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

### 2. GalleryProject
```typescript
{
  title: string
  description?: string
  imageUrl: string
  category?: string
  displayOrder: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}
```

### 3. Review
```typescript
{
  name: string
  rating: number (1-5)
  comment: string
  createdAt: Date
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/login` | No | Login with email/password |
| POST | `/logout` | No | Logout (clears cookie) |
| GET | `/me` | Yes | Get current user |
| POST | `/create-admin` | Yes | Create new admin user |

**Login Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "stewartjevaughn1@gmail.com", "password": "ChangeMe123!"}'
```

### Gallery (`/api/gallery`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Get all published projects |
| GET | `/all` | Yes | Get all projects (admin only) |
| GET | `/:id` | No | Get single project |
| POST | `/` | Yes | Create project |
| PUT | `/:id` | Yes | Update project |
| DELETE | `/:id` | Yes | Delete project |

### Reviews (`/api/reviews`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Get all reviews |
| POST | `/` | No | Create review (public) |
| DELETE | `/:id` | Yes | Delete review (admin only) |

### Upload (`/api/upload`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/` | Yes | Upload image (multipart/form-data) |
| DELETE | `/:filename` | Yes | Delete image |

---

## How to Run

### Development Mode (Runs both frontend + backend)

```bash
npm run dev
```

This starts:
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173`

### Backend Only

```bash
npm run server:dev
```

### Frontend Only

```bash
npm run client
```

### Create Admin User

```bash
npm run seed:admin
```

**Default Admin Credentials:**
- Email: `stewartjevaughn1@gmail.com`
- Password: `ChangeMe123!`

⚠️ **Change this password immediately after first login!**

---

## Authentication Flow

1. **Login**: User submits email/password
2. **Verification**: Server checks credentials against MongoDB
3. **Token Generation**: JWT token created (valid for 7 days)
4. **Storage**: Token stored in both:
   - HTTP-only cookie (secure)
   - LocalStorage (for API calls)
5. **Subsequent Requests**: Token sent via Authorization header

---

## Image Upload Flow

1. Admin selects/drops image file
2. File sent to `/api/upload` endpoint
3. Server validates file (type, size)
4. Image saved to `/public/uploads/` directory
5. Server returns public URL: `/uploads/filename.jpg`
6. URL stored in database with gallery project

**Served at**: `http://localhost:5000/uploads/filename.jpg`

---

## Next Steps (Frontend Migration)

The backend is complete and ready. Now you need to update the frontend components to use the new API.

### Files to Update:

#### 1. Admin Component ([src/pages/Admin.tsx](src/pages/Admin.tsx))

**Current**: Uses Supabase auth (`supabase.auth.signInWithPassword`)
**Update to**: Use `authAPI.login()` from `src/lib/api.ts`

**Example Update:**
```typescript
// OLD (Supabase)
const { error } = await supabase.auth.signInWithPassword({ email, password });

// NEW (MongoDB API)
import { authAPI } from "@/lib/api";
await authAPI.login(email, password);
```

#### 2. GalleryManager Component ([src/components/admin/GalleryManager.tsx](src/components/admin/GalleryManager.tsx))

**Current**: Uses Supabase database (`supabase.from('gallery_projects')`)
**Update to**: Use `galleryAPI` from `src/lib/api.ts`

**Example Update:**
```typescript
// OLD (Supabase)
const { data } = await supabase.from('gallery_projects').select('*');

// NEW (MongoDB API)
import { galleryAPI } from "@/lib/api";
const projects = await galleryAPI.getAllAdmin();
```

#### 3. ImageUpload Component ([src/components/admin/ImageUpload.tsx](src/components/admin/ImageUpload.tsx))

**Current**: Uses Supabase Storage (`supabase.storage.from('gallery-images')`)
**Update to**: Use `uploadAPI.uploadImage()` from `src/lib/api.ts`

**Example Update:**
```typescript
// OLD (Supabase)
const { error } = await supabase.storage.from('gallery-images').upload(filePath, file);

// NEW (MongoDB API)
import { uploadAPI } from "@/lib/api";
const { imageUrl } = await uploadAPI.uploadImage(file);
```

#### 4. Gallery Component ([src/components/Gallery.tsx](src/components/Gallery.tsx))

**Current**: Uses Supabase database
**Update to**: Use `galleryAPI.getAll()` from `src/lib/api.ts`

#### 5. Reviews Component

**Current**: Uses Supabase database
**Update to**: Use `reviewsAPI` from `src/lib/api.ts`

---

## API Client Usage Examples

The new API client ([src/lib/api.ts](src/lib/api.ts)) provides easy-to-use functions:

### Authentication
```typescript
import { authAPI } from "@/lib/api";

// Login
const { user, token } = await authAPI.login("email@example.com", "password");

// Logout
await authAPI.logout();

// Get current user
const user = await authAPI.getCurrentUser();

// Create new admin
await authAPI.createAdmin("newadmin@example.com", "securePassword");
```

### Gallery
```typescript
import { galleryAPI } from "@/lib/api";

// Get all published projects (public)
const projects = await galleryAPI.getAll();

// Get all projects (admin only)
const allProjects = await galleryAPI.getAllAdmin();

// Create project
const project = await galleryAPI.create({
  title: "Beautiful Kitchen Floor",
  description: "Luxury vinyl planks",
  imageUrl: "/uploads/kitchen-123456.jpg",
  category: "Kitchen",
});

// Update project
await galleryAPI.update(projectId, { title: "Updated Title" });

// Delete project
await galleryAPI.delete(projectId);
```

### Reviews
```typescript
import { reviewsAPI } from "@/lib/api";

// Get all reviews
const reviews = await reviewsAPI.getAll();

// Create review (public)
const review = await reviewsAPI.create({
  name: "John Doe",
  rating: 5,
  comment: "Excellent work!",
});

// Delete review (admin only)
await reviewsAPI.delete(reviewId);
```

### Image Upload
```typescript
import { uploadAPI } from "@/lib/api";

// Upload image
const { imageUrl, filename } = await uploadAPI.uploadImage(file);
// Returns: { imageUrl: "/uploads/123456-image.jpg", filename: "123456-image.jpg" }

// Delete image
await uploadAPI.deleteImage(filename);
```

---

## Testing the API

### 1. Start the server
```bash
npm run server:dev
```

### 2. Test health check
```bash
curl http://localhost:5000/api/health
```

### 3. Test login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "stewartjevaughn1@gmail.com", "password": "ChangeMe123!"}'
```

### 4. Test gallery (public)
```bash
curl http://localhost:5000/api/gallery
```

---

## Common Issues & Solutions

### Issue: "MONGODB_URI is not defined"
**Solution**: Make sure `.env` file exists in project root with `MONGODB_URI` set

### Issue: "Port 5000 already in use"
**Solution**: Change `PORT` in `.env` file or kill process using port 5000

### Issue: "Cannot connect to MongoDB"
**Solution**: Check MongoDB connection string is correct and MongoDB Atlas IP whitelist includes your IP

### Issue: "JWT token invalid"
**Solution**: Clear localStorage and cookies, then login again

### Issue: "Images not loading"
**Solution**: Make sure Express server is running (serves images from `/uploads`)

---

## Security Notes

### Production Checklist:
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change default admin password
- [ ] Enable HTTPS
- [ ] Update CORS origin in `server/index.ts` to your production domain
- [ ] Set `NODE_ENV=production`
- [ ] Add rate limiting to API endpoints
- [ ] Set up proper MongoDB user permissions
- [ ] Use environment variables for all secrets
- [ ] Add image upload file size limits
- [ ] Sanitize user inputs

---

## Migration Benefits

### Why MongoDB over Supabase?

1. **Full Control**: You own the entire backend logic
2. **Cost**: MongoDB free tier is generous
3. **Flexibility**: Easy to add custom endpoints
4. **No Vendor Lock-in**: Can migrate to any database
5. **Learning**: Better understanding of full-stack development

---

## Support

If you need to migrate data from Supabase to MongoDB, you'll need to:

1. Export data from Supabase (SQL or CSV)
2. Transform data to match new MongoDB schema
3. Import into MongoDB using migration script

Let me know if you need help with data migration!

---

## Quick Reference

**Start Development:**
```bash
npm run dev
```

**Create Admin:**
```bash
npm run seed:admin
```

**Backend URL:** `http://localhost:5000`
**Frontend URL:** `http://localhost:5173`
**Images URL:** `http://localhost:5000/uploads/filename.jpg`

**Admin Login:**
- Email: `stewartjevaughn1@gmail.com`
- Password: `ChangeMe123!` (⚠️ Change this!)

---

*Last Updated: December 30, 2025*
