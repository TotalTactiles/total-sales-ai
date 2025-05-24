
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  body: string
  leadId?: string
  leadName?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { to, subject, body, leadId, leadName }: EmailRequest = await req.json()

    // Get user's Gmail token
    const { data: emailToken } = await supabaseClient
      .from('email_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'gmail')
      .single()

    if (!emailToken) {
      throw new Error('Gmail not connected. Please connect Gmail first.')
    }

    // Check if token is expired and refresh if needed
    if (new Date(emailToken.token_expires_at) < new Date()) {
      if (!emailToken.refresh_token) {
        throw new Error('Gmail token expired and no refresh token available. Please reconnect Gmail.')
      }

      // Refresh the token
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
          refresh_token: emailToken.refresh_token,
          grant_type: 'refresh_token'
        })
      })

      const refreshData = await refreshResponse.json()
      
      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh Gmail token. Please reconnect Gmail.')
      }

      // Update stored token
      await supabaseClient
        .from('email_tokens')
        .update({
          access_token: refreshData.access_token,
          token_expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString()
        })
        .eq('user_id', user.id)
        .eq('provider', 'gmail')

      emailToken.access_token = refreshData.access_token
    }

    // Create email message in RFC 2822 format
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      '',
      body
    ].join('\r\n')

    // Encode email for Gmail API
    const encodedEmail = btoa(email)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Send email via Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailToken.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedEmail
      })
    })

    const gmailData = await response.json()

    if (!response.ok) {
      console.error('Gmail API error:', gmailData)
      throw new Error(`Gmail API error: ${gmailData.error?.message || 'Unknown error'}`)
    }

    // Get user's company ID for logging
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    // Log email in database
    await supabaseClient
      .from('usage_events')
      .insert({
        user_id: user.id,
        company_id: profile?.company_id,
        feature: 'email_send',
        action: 'sent',
        context: leadId ? `lead_${leadId}` : 'general',
        metadata: {
          leadName: leadName || 'Unknown',
          to,
          subject,
          messageId: gmailData.id,
          provider: 'gmail',
          bodyLength: body.length,
          timestamp: new Date().toISOString()
        }
      })

    return new Response(JSON.stringify({
      success: true,
      messageId: gmailData.id,
      message: `Email sent successfully to ${leadName || to}`,
      threadId: gmailData.threadId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in gmail-send function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
