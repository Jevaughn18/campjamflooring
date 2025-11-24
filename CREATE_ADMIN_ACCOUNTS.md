# Create Admin Accounts - Quick Guide

## Admin Emails to Create:
1. **stewartjevaughn1@gmail.com** (Your email)
2. **allyandre64@gmail.com** (Your friend's email)

## Default Password for Both:
```
CampJam2025!
```

---

## Step 1: Add to Database Whitelist

Go to Supabase SQL Editor:
https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/sql/new

Paste this SQL and click **Run**:

```sql
-- Add both emails to whitelist
INSERT INTO admin_users (email, created_by)
VALUES
  ('stewartjevaughn1@gmail.com', 'system'),
  ('allyandre64@gmail.com', 'system')
ON CONFLICT (email) DO NOTHING;
```

---

## Step 2: Create Auth Accounts

Go to Supabase Authentication:
https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/auth/users

### For stewartjevaughn1@gmail.com:
1. Click **"Add user"** dropdown → **"Create new user"**
2. **Email:** `stewartjevaughn1@gmail.com`
3. **Password:** `CampJam2025!`
4. **Auto Confirm User:** ✅ **YES** (check this box!)
5. Click **"Create user"**

### For allyandre64@gmail.com:
1. Click **"Add user"** dropdown → **"Create new user"**
2. **Email:** `allyandre64@gmail.com`
3. **Password:** `CampJam2025!`
4. **Auto Confirm User:** ✅ **YES** (check this box!)
5. Click **"Create user"**

---

## Step 3: Test Login

### Test Your Account:
1. Go to: http://localhost:8080/admin
2. **Email:** stewartjevaughn1@gmail.com
3. **Password:** CampJam2025!
4. Click **Sign In**

### Test Friend's Account:
1. Go to: http://localhost:8080/admin
2. **Email:** allyandre64@gmail.com
3. **Password:** CampJam2025!
4. Click **Sign In**

---

## For Your Friend (In Production):

Once deployed to Vercel:

**Login URL:** https://your-site.vercel.app/admin

**Email:** allyandre64@gmail.com
**Password:** CampJam2025!

They can now:
- View and delete customer reviews
- Add new admin users
- Remove admin users

---

## Adding More Admins Later

Your friend can add new admins from the dashboard:

1. Log in to `/admin`
2. Click **"Manage Admins"**
3. Enter new admin email
4. Click **"Add Admin"**
5. Tell that person to log in with email + password: `CampJam2025!`

**Note:** You still need to manually create their Supabase Auth account (Step 2 above) after adding them to the whitelist.

---

## Important Notes

- ✅ All admins use the same password: `CampJam2025!`
- ✅ Admins are managed in the "Manage Admins" section
- ✅ No email setup needed
- ✅ No SMTP configuration needed
- ⚠️ Make sure to check "Auto Confirm User" when creating accounts
- ⚠️ New admins need both: whitelist entry + Supabase Auth account

---

## Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh
- **SQL Editor:** https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/sql/new
- **Auth Users:** https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/auth/users
- **Admin Panel (Local):** http://localhost:8080/admin
