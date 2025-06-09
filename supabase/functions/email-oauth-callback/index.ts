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

    const { provider, code, state } = await req.json()
    
    // Verify state parameter for security
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    let tokenData
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    
    if (provider === 'gmail') {
      // Exchange code for tokens with Google
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${supabaseUrl}/functions/v1/email-oauth-callback`
        })
      })
      
      tokenData = await tokenResponse.json()
      
      // Get user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
      })
      const userInfo = await userInfoResponse.json()
      
      // Store tokens securely
      await supabaseClient.from('email_tokens').upsert({
        user_id: user.id,
        provider: 'gmail',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      })
      
      // Update profile
      await supabaseClient.from('profiles').update({
        email_connected: true,
        email_provider: 'gmail',
        email_account: userInfo.email
      }).eq('id', user.id)
      
    } else if (provider === 'outlook') {
      // Exchange code for tokens with Microsoft
      const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: Deno.env.get('MICROSOFT_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('MICROSOFT_CLIENT_SECRET') ?? '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${supabaseUrl}/functions/v1/email-oauth-callback`
        })
      })
      
      tokenData = await tokenResponse.json()
      
      // Get user info from Microsoft Graph
      const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
      })
      const userInfo = await userInfoResponse.json()
      
      // Store tokens securely
      await supabaseClient.from('email_tokens').upsert({
        user_id: user.id,
        provider: 'outlook',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      })
      
      // Update profile
      await supabaseClient.from('profiles').update({
        email_connected: true,
        email_provider: 'outlook',
        email_account: userInfo.mail || userInfo.userPrincipalName
      }).eq('id', user.id)
    }

    return new Response(
      JSON.stringify({ success: true, provider, email: tokenData.email }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    logger.error('OAuth callback error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
