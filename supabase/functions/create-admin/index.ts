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

    // Generate password reset link
    console.log(`Generating password reset link for: ${email}`)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    })

    if (linkError || !linkData) {
      console.error('Error generating reset link:', linkError)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to generate password reset link',
          details: linkError?.message
        }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    console.log('Password reset link generated:', linkData.properties.action_link)

    // Send email using Resend
    console.log(`Sending email via Resend to: ${email}`)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not set')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured. Please set RESEND_API_KEY.',
        }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CampJam Flooring Admin <onboarding@resend.dev>', // Change this to your verified domain
        to: [email],
        subject: 'Set Your CampJam Flooring Admin Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to CampJam Flooring Admin</h2>
            <p>You've been added as an administrator for the CampJam Flooring website.</p>
            <p>Click the button below to set your password and access the admin panel:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkData.properties.action_link}"
                 style="background-color: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Set Your Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't expect this email, you can safely ignore it.</p>
            <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px;">CampJam Flooring<br>Portmore, St.Catherine, Jamaica</p>
          </div>
        `,
      }),
    })

    const emailResult = await emailResponse.json()

    if (!emailResponse.ok) {
      console.error('Email sending failed:', emailResult)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email',
          details: emailResult.message || emailResult.error
        }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    console.log('Email sent successfully via Resend:', emailResult)

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
