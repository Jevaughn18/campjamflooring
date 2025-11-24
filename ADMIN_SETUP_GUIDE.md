# Admin Setup Guide - Simple & Working

## Step 1: Create Admin Table in Supabase (One Time Only)

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Copy/paste this SQL and click **Run**:

```sql
-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin_users"
  ON admin_users FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert admin_users"
  ON admin_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin_users"
  ON admin_users FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete admin_users"
  ON admin_users FOR DELETE USING (true);

-- Add YOUR email as first admin
INSERT INTO admin_users (email, created_by)
VALUES ('stewartjevaughn1@gmail.com', 'system')
ON CONFLICT (email) DO NOTHING;

CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);
```

---

## Step 2: Create Your Admin Account in Supabase

1. Still in Supabase Dashboard
2. Click **Authentication** → **Users**
3. Click **Add User** (or **Invite User**)
4. Enter:
   - **Email:** stewartjevaughn1@gmail.com
   - **Password:** CampJam2025! (or any password you want)
   - **Auto Confirm User:** ✅ YES (check this!)
5. Click **Create User** or **Send Invite**

---

## Step 3: Test Your Login

1. Go to: http://localhost:8080/admin (local) or https://your-domain.com/admin (production)
2. Sign in with:
   - Email: stewartjevaughn1@gmail.com
   - Password: CampJam2025! (or whatever you set)
3. You should now see the Admin Dashboard!

---

## How to Add Your Friend as Admin

### Step A: Whitelist Their Email

1. Log in to `/admin`
2. Click **"Manage Admins"** button
3. Enter your friend's email
4. Click **"Add Email"**

### Step B: Create Their Supabase Account

1. Go to Supabase → **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - **Email:** yourfriend@email.com
   - **Password:** CampJam2025! (temporary password)
   - **Auto Confirm User:** ✅ YES
4. Click **Create User**

### Step C: Share Credentials

Tell your friend:
- **Admin URL:** https://your-domain.com/admin
- **Email:** yourfriend@email.com
- **Default Password:** CampJam2025!
- **Tell them:** "Log in, then click 'Change Password' to set your own password"

---

## How Users Change Their Password

1. Log in to `/admin` with default password
2. Click **"Change Password"** button (top right)
3. Enter new password twice
4. Click **"Update Password"**
5. Done! They can now use their new password

---

## Important Notes

### Why No Email Reset?
- Email reset requires SMTP configuration in Supabase (not included in free tier)
- Manual account creation is simpler and more reliable
- Users can change passwords once logged in

### Who Can Access Admin?
- **ONLY** emails in `admin_users` table
- **AND** accounts must exist in Supabase Authentication
- Both conditions must be true

### Default Passwords
- Use: `CampJam2025!` or similar
- Share securely (text message, in person, encrypted email)
- Users MUST change after first login

---

## Quick Reference

### Admin Dashboard Features:
- ✅ View all customer reviews
- ✅ Delete inappropriate reviews
- ✅ Whitelist new admin emails
- ✅ Change your own password
- ✅ Remove admin access (can't remove yourself)

### Default Admin:
- **Email:** stewartjevaughn1@gmail.com
- **Access:** Full admin control
- **Can do:** Everything (manage admins, delete reviews, change password)

### To Delete a Review:
1. Log in to `/admin`
2. Find the review
3. Click red trash icon
4. Confirm: "Are you sure you want to delete this review? This cannot be undone"
5. Done!

---

## Troubleshooting

### "Access Denied" Error
- ✅ Check email is in `admin_users` table (Supabase → Table Editor)
- ✅ Check account exists in Authentication (Supabase → Authentication → Users)
- ✅ Check `is_active` is `true` in `admin_users` table
- ✅ Email must match exactly (case doesn't matter)

### "Invalid Credentials" Error
- ❌ Wrong password
- ✅ Go to Supabase → Authentication → Find user → Reset password manually
- ✅ Or create new account if needed

### Can't Add New Admin
- ✅ Make sure you're logged in
- ✅ Email format must be valid
- ✅ After whitelisting, create account in Supabase Authentication

---

## For Your Friend (Non-Technical Owner)

### To Manage Reviews:
1. Visit: https://your-domain.com/admin
2. Sign in with email and password
3. Click trash icon next to bad reviews
4. Click "Delete Review" to confirm

### To Change Password:
1. Log in to admin panel
2. Click "Change Password" button
3. Enter new password twice
4. Click "Update Password"

### To Add Another Admin:
1. Log in to admin panel
2. Click "Manage Admins"
3. Enter their email, click "Add Email"
4. Tell them to contact you for Supabase access (OR)
5. Give them Supabase login so they can create user themselves

---

## Cost Summary

- **Admin System:** Free ✅
- **Supabase Database:** Free (Hobby Plan)
- **Supabase Auth:** Free (unlimited users)
- **Vercel Hosting:** Free (Hobby Plan)
- **Domain:** ~$12/year

**Total:** $12/year (just the domain!)
