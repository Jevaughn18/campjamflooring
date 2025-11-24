# Gmail SMTP Setup for Supabase Auth Emails

This guide shows you how to configure Gmail SMTP in Supabase so that admin emails and password resets work automatically.

---

## Step 1: Create a Gmail App Password

### 1.1 Enable 2-Factor Authentication (if not already enabled)

1. Go to: https://myaccount.google.com/security
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the steps to enable it (you'll need your phone)

### 1.2 Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if needed
3. Under "Select app", choose **Mail**
4. Under "Select device", choose **Other (Custom name)**
5. Type: `Supabase CampJam`
6. Click **Generate**
7. **COPY THE 16-CHARACTER PASSWORD** (e.g., `abcd efgh ijkl mnop`)
   - ⚠️ Save this somewhere safe - you won't see it again!

---

## Step 2: Configure SMTP in Supabase

### 2.1 Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Select your project: **bwhjvxiuemwbtwqgzpfh**
3. Click **Authentication** (left sidebar)
4. Click **Email Templates** tab
5. Scroll down to **SMTP Settings** section

### 2.2 Fill in SMTP Settings

**Enable Custom SMTP:** ✅ Turn ON

**SMTP Host:**
```
smtp.gmail.com
```

**SMTP Port:**
```
587
```

**SMTP Username:**
```
stewartjevaughn1@gmail.com
```
(or whichever Gmail you're using)

**SMTP Password:**
```
abcd efgh ijkl mnop
```
(the 16-character app password from Step 1.2 - **remove spaces!**)

**Sender Email:**
```
stewartjevaughn1@gmail.com
```

**Sender Name:**
```
CampJam Flooring Admin
```

### 2.3 Save Settings

Click **Save** button at the bottom

---

## Step 3: Test Email Sending

### Option A: Test via Admin Panel (Easiest)

1. Go to: http://localhost:8080/admin (or your production URL)
2. Log in with your account
3. Click **"Manage Admins"**
4. Enter a test email (can be your own email)
5. Click **"Add Admin"**
6. Check the email inbox - you should receive a password setup email!

### Option B: Test via Password Reset

1. Go to: http://localhost:8080/admin
2. Click **"Forgot Password Or First Time Logging In?"**
3. Enter your email
4. Click **"Send Reset Link"**
5. Check your inbox for the reset email

---

## Step 4: Customize Email Templates (Optional)

You can customize the emails that Supabase sends:

1. In Supabase Dashboard → **Authentication** → **Email Templates**
2. You'll see templates for:
   - **Confirm Signup** (when new admin is added)
   - **Reset Password** (when they click "Forgot Password")
   - **Magic Link** (not used in this setup)
   - **Change Email** (not used in this setup)

### Example: Customize Password Reset Email

Click on **Reset Password** template and edit:

```html
<h2>Reset Your CampJam Flooring Admin Password</h2>

<p>Hi there,</p>

<p>You requested to reset your password for the CampJam Flooring admin panel.</p>

<p>Click the link below to set a new password:</p>

<p><a href="{{ .ConfirmationURL }}">Set New Password</a></p>

<p>If you didn't request this, you can safely ignore this email.</p>

<p>Thanks,<br>
CampJam Flooring Team</p>
```

Click **Save** after editing.

---

## How It Works Now

### For Your Friend (Business Owner):

**To add a new admin employee:**

1. Log in to `/admin`
2. Click **"Manage Admins"**
3. Enter employee's email
4. Click **"Add Admin"**
5. Tell employee: "Check your email for a password setup link"

**That's it!** Your friend doesn't need to know about Supabase, passwords, or technical stuff.

### For the New Admin Employee:

1. Check email inbox
2. Click the link in the email
3. Create a password
4. Go to the admin panel and log in

### For Password Resets:

Anyone (including your friend) can:

1. Go to `/admin`
2. Click "Forgot Password"
3. Enter their email
4. Check email for reset link
5. Click link and set new password

---

## Troubleshooting

### Email Not Arriving

**Check 1: Spam Folder**
- Gmail might mark it as spam initially
- Check spam folder and mark as "Not Spam"

**Check 2: App Password**
- Make sure you used the **16-character app password**, not your regular Gmail password
- Remove all spaces from the password
- Example: `abcdefghijklmnop` (no spaces)

**Check 3: 2-Factor Authentication**
- Gmail requires 2FA to be enabled for app passwords
- Verify at: https://myaccount.google.com/security

**Check 4: SMTP Port**
- Make sure port is **587** (not 465 or 25)
- Port 587 uses STARTTLS encryption

**Check 5: Supabase Logs**
- Go to Supabase → Logs → Auth Logs
- Look for email sending errors

### "Access Denied" Error

**Solution:** Your email is whitelisted but no Supabase auth account exists yet.

**Fix:**
1. Admin adds your email via "Manage Admins"
2. You receive email with setup link
3. Click link to create account
4. Now you can log in

### "SMTP Configuration Error"

**Solution:** SMTP settings aren't saved correctly.

**Fix:**
1. Go back to Supabase → Authentication → Email Templates
2. Scroll to SMTP Settings
3. Re-enter all details (especially remove spaces from password)
4. Click **Save**
5. Try sending test email again

---

## Alternative: SendGrid (If Gmail Doesn't Work)

If Gmail gives you issues, you can use SendGrid (also free):

1. Sign up at: https://sendgrid.com (free tier: 100 emails/day)
2. Create API Key
3. Use these settings in Supabase:

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP Username: apikey
SMTP Password: <your-sendgrid-api-key>
Sender Email: stewartjevaughn1@gmail.com
```

---

## Summary

### What You Did:
1. ✅ Created Gmail App Password
2. ✅ Configured SMTP in Supabase
3. ✅ Tested email sending
4. ✅ (Optional) Customized email templates

### What Your Friend Can Do:
- ✅ Add new admins from dashboard (they get email automatically)
- ✅ Employees can reset passwords via email
- ✅ No technical knowledge required

### Monthly Cost:
- **Gmail SMTP:** Free ✅
- **SendGrid (alternative):** Free up to 100 emails/day ✅

---

## Quick Reference

### Gmail App Password URL:
https://myaccount.google.com/apppasswords

### Supabase SMTP Settings:
Dashboard → Authentication → Email Templates → SMTP Settings

### Test Email:
Admin Panel → Manage Admins → Add Admin

---

## For Future Reference

### If you change Gmail account:
1. Generate new app password for new Gmail
2. Update SMTP settings in Supabase
3. Update "Sender Email" field

### If emails stop working:
1. Check if Gmail app password was revoked
2. Generate new app password
3. Update in Supabase SMTP settings

### If your friend wants to manage emails:
- They can use the same Gmail
- Or set up their own Gmail and update SMTP settings
- Emails will come from whichever Gmail is configured
