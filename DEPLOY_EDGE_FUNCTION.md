# Deploy Supabase Edge Function

This guide shows you how to deploy the `create-admin` edge function to Supabase so that admins can be created automatically from the dashboard.

---

## Prerequisites

1. **Install Supabase CLI:**

```bash
brew install supabase/tap/supabase
```

(Or visit: https://supabase.com/docs/guides/cli for other installation methods)

2. **Login to Supabase:**

```bash
supabase login
```

This will open your browser to authenticate.

---

## Deploy the Edge Function

### Step 1: Link Your Project

```bash
cd /Users/jevaughnstewart/campjamflooring/campjamflooring
supabase link --project-ref bwhjvxiuemwbtwqgzpfh
```

When prompted, enter your database password (from Supabase dashboard).

### Step 2: Deploy the Function

```bash
supabase functions deploy create-admin
```

This will upload the edge function to Supabase.

### Step 3: Set Environment Variables

The edge function needs access to your Service Role Key (server-side only):

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find your Service Role Key:**
1. Go to: https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/settings/api
2. Look for **"service_role" key** under "Project API keys"
3. Copy it (it starts with `eyJ...`)
4. Run the command above with your key

---

## Test the Edge Function

After deploying, test it:

1. Go to http://localhost:8080/admin
2. Log in
3. Click "Manage Admins"
4. Enter a test email
5. Click "Add Admin"
6. Check the browser console for logs
7. Check your email inbox!

---

## How It Works

```
Your Friend (Admin Dashboard)
    ↓
Enters new admin email → Click "Add Admin"
    ↓
Frontend adds email to whitelist table
    ↓
Frontend calls Edge Function (server-side)
    ↓
Edge Function creates Supabase Auth account
    ↓
Edge Function triggers password reset email
    ↓
New admin receives email with setup link
    ↓
New admin sets password and logs in
```

---

## Troubleshooting

### Error: "supabase: command not found"

Install Supabase CLI first:
```bash
brew install supabase/tap/supabase
```

### Error: "Project not linked"

Run:
```bash
supabase link --project-ref bwhjvxiuemwbtwqgzpfh
```

### Error: "Service role key not set"

Run:
```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Edge Function Returns 401

- Make sure you're logged in
- Check that SMTP is configured in Supabase

### Email Not Arriving

- Check Gmail SMTP settings in Supabase
- Check spam folder
- Check Supabase logs: Dashboard → Logs → Edge Functions

---

## Alternative: Deploy via Supabase Dashboard

If CLI doesn't work, you can deploy manually:

1. Go to: https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/functions
2. Click "Create a new function"
3. Name: `create-admin`
4. Copy/paste the code from `supabase/functions/create-admin/index.ts`
5. Click "Deploy function"
6. Go to Settings → Add secret: `SUPABASE_SERVICE_ROLE_KEY` = your service role key

---

## Once Deployed

Your friend can now:
1. Log in to `/admin`
2. Click "Manage Admins"
3. Enter any email
4. Click "Add Admin"
5. That person automatically gets an email to set their password

**No more manual Supabase account creation!** 🎉
