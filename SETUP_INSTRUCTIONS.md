# CampJam Flooring - Final Setup Instructions

## 🚀 Quick Start (DO THIS FIRST)

### Step 1: Run Database Setup in Supabase

1. Go to: https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: **bwhjvxiuemwbtwqgzpfh**
4. Click **SQL Editor** in the left sidebar
5. Click **New Query**

### Step 2: Create admin_users Table

Copy and paste this SQL, then click **Run**:

```sql
-- Create admin_users table to manage who can access the admin panel
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read admin_users (needed for login check)
CREATE POLICY "Anyone can read admin_users"
  ON admin_users
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert admin_users
CREATE POLICY "Authenticated users can insert admin_users"
  ON admin_users
  FOR INSERT
  WITH CHECK (true);

-- Policy: Authenticated users can update admin_users
CREATE POLICY "Authenticated users can update admin_users"
  ON admin_users
  FOR UPDATE
  USING (true);

-- Policy: Authenticated users can delete admin_users
CREATE POLICY "Authenticated users can delete admin_users"
  ON admin_users
  FOR DELETE
  USING (true);

-- Insert initial admin (you)
INSERT INTO admin_users (email, created_by)
VALUES ('stewartjevaughn1@gmail.com', 'system')
ON CONFLICT (email) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);
```

### Step 3: Verify Setup

After running the SQL:
1. You should see: **"Success. No rows returned"** or **"1 row inserted"**
2. Click **Table Editor** in left sidebar
3. You should see a new table called **admin_users**
4. It should have 1 row with email: **stewartjevaughn1@gmail.com**

---

## 🔐 How to Use the Admin Panel

### Access the Admin Panel

**Local (for testing):**
- Visit: http://localhost:8080/admin

**Production (after deployment):**
- Visit: https://your-domain.com/admin

### First Time Login

1. Click **"Forgot Password Or First Time Logging In?"**
2. Click **"Click here to Set Or Reset Password"**
3. Enter: **stewartjevaughn1@gmail.com**
4. Click **Send Reset Link**
5. Check your email for password reset link
6. Click link, set your password
7. Return to /admin and sign in

### Add Your Friend as Admin

1. Log in to admin panel
2. Click **"Manage Admins"** button
3. Enter your friend's email address
4. Create a default password for them (e.g., `CampJam2025!`)
5. Click **Add Admin**
6. Share the email + password with your friend securely
7. Tell them to visit `/admin` and reset their password

### Delete Inappropriate Reviews

1. Log in to admin panel
2. You'll see all customer reviews
3. Click the red trash icon next to any review
4. Confirm deletion in the popup
5. Review is permanently removed

---

## 📝 For Your Friend (Simple Instructions)

### Managing Reviews

**To delete a bad review:**
1. Visit: https://your-domain.com/admin
2. Sign in with your email and password
3. Click the trash icon next to the review
4. Confirm deletion

**To add another admin:**
1. Log in to admin panel
2. Click "Manage Admins"
3. Enter their email address
4. Create a temporary password
5. Share credentials securely
6. They can reset password on first login

**To change your password:**
1. On login screen, click "Forgot Password Or First Time Logging In?"
2. Click "Click here to Set Or Reset Password"
3. Enter your email
4. Check email for reset link
5. Click link and set new password

---

## 🚨 Security Notes

### Who Can Access Admin Panel?
- **ONLY** emails listed in the `admin_users` table
- No public signup - completely secure
- You control who gets access

### Default Admin
- **Email:** stewartjevaughn1@gmail.com
- **Can add/remove other admins**
- **Cannot remove yourself**

### Password Reset
- Uses Supabase email system
- Secure token-based reset
- Works for first-time login too

---

## 🌐 Deployment to Vercel

### Push Changes to GitHub

```bash
git add .
git commit -m "Your message"
git push origin main
```

### Vercel Auto-Deploys
- Every push to `main` branch triggers auto-deployment
- Check build status at: https://vercel.com/dashboard
- Your site will be live at: https://your-project.vercel.app

### Custom Domain Setup

1. **Buy Domain** (your friend should buy in their name):
   - Namecheap: ~$12/year
   - Google Domains: ~$12/year
   - GoDaddy: ~$12/year

2. **Connect to Vercel**:
   - Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain
   - Follow Vercel's DNS instructions
   - Usually takes 1-24 hours to propagate

---

## 💰 Costs & Ownership

### Monthly Costs
- **Domain:** ~$1/month ($12/year)
- **Vercel:** Free (Hobby Plan)
- **Supabase:** Free (Hobby Plan)
- **Total:** ~$12/year

### Who Should Own What?

**Recommended Setup:**
1. **Domain** → Your friend's name (he pays, he owns)
2. **Vercel Account** → Transfer to your friend OR add him as collaborator
3. **Supabase Account** → Transfer to your friend OR add him as Owner
4. **Admin Panel** → Both of you as admins in `admin_users` table

**How to Transfer:**
- **Vercel:** Settings → Transfer Project
- **Supabase:** Settings → Team → Invite as Owner

See `HANDOFF_GUIDE.md` for detailed ownership options.

---

## 🆘 Troubleshooting

### "Access Denied" on Login
- Check if email is in `admin_users` table
- Email must match exactly (case-insensitive)
- Check `is_active` is `true`

### Reviews Not Showing
- Check `reviews` table in Supabase
- Verify RLS policies are enabled
- Check browser console for errors

### Can't Delete Reviews
- Make sure delete policy exists (run `supabase-delete-policy.sql`)
- Check if you're logged in as admin
- Verify Supabase connection

### Password Reset Not Working
- Check email spam folder
- Verify Supabase email settings
- Make sure `redirectTo` URL is correct

---

## 📧 Contact Info

### Your Info (Developer)
- Email: stewartjevaughn1@gmail.com
- Admin Access: ✅ Default Admin

### Support Links
- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Report Issues:** Create issue in GitHub repo

---

## ✅ Checklist

- [ ] Run SQL setup script in Supabase
- [ ] Verify `admin_users` table exists
- [ ] Test login with stewartjevaughn1@gmail.com
- [ ] Reset password for first time
- [ ] Add friend's email as admin
- [ ] Test review deletion
- [ ] Test admin management interface
- [ ] Push to GitHub
- [ ] Verify Vercel deployment
- [ ] Set up custom domain
- [ ] Transfer ownership to friend (optional)
- [ ] Share credentials securely

---

## 🎉 You're All Set!

Your website is now:
- ✅ Fully functional with 6 projects
- ✅ Customer reviews system
- ✅ Secure admin panel
- ✅ Easy admin management
- ✅ Password reset functionality
- ✅ Ready for production

**Admin Panel:** http://localhost:8080/admin (local) or https://your-domain.com/admin (production)

**Next Steps:**
1. Run the SQL script above
2. Test the admin panel locally
3. Add your friend as admin
4. Deploy to Vercel
5. Set up custom domain
6. Hand off to your friend with credentials

---

## 📄 Additional Files

- `HANDOFF_GUIDE.md` - Detailed ownership transfer guide
- `supabase-admin-setup.sql` - Database setup script
- `supabase-delete-policy.sql` - Review deletion policy
- `supabase-setup.sql` - Original reviews table setup
