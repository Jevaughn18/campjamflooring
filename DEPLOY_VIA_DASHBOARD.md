# Deploy Edge Function via Supabase Dashboard (Easier Method!)

Skip the CLI and deploy directly from the browser!

---

## Step 1: Go to Edge Functions Page

Visit: https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/functions

---

## Step 2: Create New Function

1. Click **"Create a new function"** button
2. **Function name:** `create-admin`
3. Leave other settings as default
4. Click **"Create function"**

---

## Step 3: Copy the Edge Function Code

Open the file: `supabase/functions/create-admin/index.ts`

Or copy this code:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Get the email from request body
    const { email } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Create admin client with service role key (server-side only!)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log(`Creating user account for: ${email}`)

    // Create the user account with a random temporary password
    const randomPassword = crypto.randomUUID()
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: randomPassword,
      email_confirm: true,
    })

    if (createError) {
      console.error('Error creating user:', createError)

      // If user already exists, that's okay - just send reset email
      if (createError.message.includes('already registered')) {
        console.log('User already exists, sending password reset...')
      } else {
        return new Response(JSON.stringify({ error: createError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }
    } else {
      console.log('User created successfully:', userData)
    }

    // Send password reset email
    console.log(`Sending password reset email to: ${email}`)
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    })

    if (resetError) {
      console.error('Error sending reset email:', resetError)
      return new Response(
        JSON.stringify({
          success: true,
          warning: 'User created but failed to send email. User may need to use "Forgot Password".',
          error: resetError.message
        }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    console.log('Password reset email sent successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin user created and email sent successfully',
        email: email
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```

---

## Step 4: Paste Code and Deploy

1. Paste the code into the editor
2. Click **"Deploy"** button
3. Wait for deployment to complete

---

## Step 5: Add Service Role Key Secret

1. Go to: https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/settings/vault
2. Click **"New secret"**
3. **Name:** `SUPABASE_SERVICE_ROLE_KEY`
4. **Value:** Get your service role key from https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh/settings/api
   - Look for **"service_role"** key
   - It starts with `eyJ...`
   - Copy and paste it
5. Click **"Add secret"**

---

## Step 6: Test It!

1. Go to http://localhost:8080/admin
2. Log in
3. Click "Manage Admins"
4. Enter test email (like your own email)
5. Click "Add Admin"
6. Check browser console for logs
7. Check your email inbox!

---

## Troubleshooting

### Function Deploy Fails

- Check for syntax errors in the code
- Make sure you copied the entire code
- Try refreshing the page and deploying again

### "Service Role Key Not Found" Error

- Make sure you added the secret in Step 5
- The secret name must be exactly: `SUPABASE_SERVICE_ROLE_KEY`
- The value must be your actual service role key

### Edge Function Returns 401

- Check that you're logged in to the admin panel
- Check that SMTP is configured

### Email Not Arriving

- Verify Gmail SMTP settings are correct
- Check spam folder
- Check Supabase function logs for errors

---

## After Deployment

Your friend can now:
- Log in to `/admin`
- Click "Manage Admins"
- Enter employee email
- Click "Add Admin"
- Employee receives email automatically!

**No more manual Supabase work!** 🎉
