import { logger } from '../../../src/utils/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { action, code } = await req.json()

    const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/gmail-oauth`

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured')
    }

    if (action === 'getAuthUrl') {
      // Generate OAuth URL for Gmail access
      const scopes = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' ')

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${user.id}`

      return new Response(JSON.stringify({ 
        authUrl,
        message: 'Click the URL to authorize Gmail access'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'exchangeCode') {
      // Exchange authorization code for tokens
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      })

      const tokens = await response.json()

      if (!response.ok) {
        throw new Error(`OAuth error: ${tokens.error_description || tokens.error}`)
      }

      // Get user email from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${tokens.access_token}` }
      })
      
      const userInfo = await userInfoResponse.json()

      // Store tokens in database
      const { error } = await supabaseClient
        .from('email_tokens')
        .upsert({
          user_id: user.id,
          provider: 'gmail',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          email_address: userInfo.email
        })

      if (error) {
        console.error('Database error:', error)
        throw new Error('Failed to store tokens')
      }

      // Update user profile
      await supabaseClient
        .from('profiles')
        .update({
          email_connected: true,
          email_provider: 'gmail',
          email_account: userInfo.email
        })
        .eq('id', user.id)

      // Log successful connection
      const { error: usageError } = await supabaseClient
        .from('usage_events')
        .insert({
          user_id: user.id,
          feature: 'gmail_oauth',
          action: 'connected',
          context: 'integration_setup',
          metadata: {
            email: userInfo.email,
            provider: 'gmail',
            timestamp: new Date().toISOString()
          }
        })

      if (usageError) {
        console.error('Failed to log Gmail OAuth event:', usageError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to log event' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Gmail connected successfully for ${userInfo.email}`,
        email: userInfo.email
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'checkStatus') {
      // Check current connection status
      const { data: emailToken } = await supabaseClient
        .from('email_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'gmail')
        .single()

      if (!emailToken) {
        return new Response(JSON.stringify({
          connected: false,
          message: 'Gmail not connected'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Check if token is still valid
      const isExpired = new Date(emailToken.token_expires_at) < new Date()
      
      return new Response(JSON.stringify({
        connected: !isExpired,
        email: emailToken.email_address,
        message: isExpired ? 'Token expired, please reconnect' : 'Gmail connected'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Error in gmail-oauth function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
