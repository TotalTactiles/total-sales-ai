import { logger } from '../_shared/logger.ts';

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

    const { action, provider, code } = await req.json()
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const redirectUri = `${supabaseUrl}/functions/v1/unified-oauth`;

    if (action === 'getAuthUrl') {
      let authUrl = '';
      
      switch (provider) {
        case 'gmail':
          const gmailScopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/userinfo.email'
          ].join(' ');
          
          authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${Deno.env.get('GOOGLE_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(gmailScopes)}&` +
            `access_type=offline&` +
            `prompt=consent&` +
            `state=${user.id}_${provider}`;
          break;

        case 'outlook':
          const outlookScopes = [
            'https://graph.microsoft.com/Mail.Read',
            'https://graph.microsoft.com/User.Read'
          ].join(' ');
          
          authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
            `client_id=${Deno.env.get('MICROSOFT_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(outlookScopes)}&` +
            `response_mode=query&` +
            `state=${user.id}_${provider}`;
          break;

        case 'linkedin':
          const linkedinScopes = [
            'r_liteprofile', 
            'r_organization_social',
            'r_basicprofile',
            'r_organization_social'
          ].join(' ');
          
          authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
            `client_id=${Deno.env.get('LINKEDIN_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(linkedinScopes)}&` +
            `state=${user.id}_${provider}`;
          break;

        case 'facebook':
          const facebookScopes = [
            'pages_read_engagement', 
            'pages_show_list',
            'public_profile',
            'email'
          ].join(',');
          
          authUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
            `client_id=${Deno.env.get('FACEBOOK_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${encodeURIComponent(facebookScopes)}&` +
            `response_type=code&` +
            `state=${user.id}_${provider}`;
          break;

        case 'instagram':
          const instagramScopes = [
            'instagram_basic',
            'instagram_manage_insights',
            'pages_show_list'
          ].join(',');
          
          authUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
            `client_id=${Deno.env.get('FACEBOOK_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${encodeURIComponent(instagramScopes)}&` +
            `response_type=code&` +
            `state=${user.id}_${provider}`;
          break;

        case 'twitter':
          const twitterScopes = 'tweet.read users.read offline.access';
          
          authUrl = `https://twitter.com/i/oauth2/authorize?` +
            `client_id=${Deno.env.get('TWITTER_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(twitterScopes)}&` +
            `state=${user.id}_${provider}&` +
            `code_challenge=challenge&` +
            `code_challenge_method=plain`;
          break;

        default:
          throw new Error(`Provider ${provider} not supported yet`);
      }

      return new Response(JSON.stringify({ 
        authUrl,
        message: `Click the URL to authorize ${provider} access`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'handleCallback') {
      const { code, state } = await req.json();
      const [userId, providerName] = state.split('_');
      
      if (userId !== user.id) {
        throw new Error('Invalid state parameter');
      }

      let tokenData;
      let userInfo;

      switch (providerName) {
        case 'gmail':
          // Exchange code for tokens with Google
          const gmailTokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
              client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
              code,
              grant_type: 'authorization_code',
              redirect_uri: redirectUri
            })
          });
          
          tokenData = await gmailTokenResponse.json();
          
          const gmailUserResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
          });
          userInfo = await gmailUserResponse.json();
          break;

        case 'outlook':
          // Exchange code for tokens with Microsoft
          const outlookTokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: Deno.env.get('MICROSOFT_CLIENT_ID') ?? '',
              client_secret: Deno.env.get('MICROSOFT_CLIENT_SECRET') ?? '',
              code,
              grant_type: 'authorization_code',
              redirect_uri: redirectUri
            })
          });
          
          tokenData = await outlookTokenResponse.json();
          
          const outlookUserResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
          });
          userInfo = await outlookUserResponse.json();
          break;

        case 'facebook':
        case 'instagram':
          // Exchange code for tokens with Facebook
          const fbTokenResponse = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: Deno.env.get('FACEBOOK_CLIENT_ID') ?? '',
              client_secret: Deno.env.get('FACEBOOK_CLIENT_SECRET') ?? '',
              code,
              redirect_uri: redirectUri
            })
          });
          
          tokenData = await fbTokenResponse.json();
          
          const fbUserResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`);
          userInfo = await fbUserResponse.json();
          break;

        case 'linkedin':
          // Exchange code for tokens with LinkedIn
          const linkedinTokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: Deno.env.get('LINKEDIN_CLIENT_ID') ?? '',
              client_secret: Deno.env.get('LINKEDIN_CLIENT_SECRET') ?? '',
              code,
              grant_type: 'authorization_code',
              redirect_uri: redirectUri
            })
          });
          
          tokenData = await linkedinTokenResponse.json();
          
          const linkedinUserResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,emailAddress)', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
          });
          userInfo = await linkedinUserResponse.json();
          break;

        case 'twitter':
          // Exchange code for tokens with Twitter
          const twitterTokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${btoa(Deno.env.get('TWITTER_CLIENT_ID') + ':' + Deno.env.get('TWITTER_CLIENT_SECRET'))}`
            },
            body: new URLSearchParams({
              code,
              grant_type: 'authorization_code',
              redirect_uri: redirectUri,
              code_verifier: 'challenge'
            })
          });
          
          tokenData = await twitterTokenResponse.json();
          
          const twitterUserResponse = await fetch('https://api.twitter.com/2/users/me', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
          });
          const twitterData = await twitterUserResponse.json();
          userInfo = twitterData.data;
          break;
      }

      // Store OAuth connection in database
      const { error } = await supabaseClient
        .from('oauth_connections')
        .upsert({
          user_id: user.id,
          provider: providerName,
          provider_user_id: userInfo.id || userInfo.sub,
          email: userInfo.email || userInfo.emailAddress || null,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          expires_at: tokenData.expires_in ? 
            new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
          account_info: userInfo,
          last_sync: new Date().toISOString()
        });

      if (error) {
        logger.error('Database error:', error);
        throw new Error('Failed to store OAuth connection');
      }

      return new Response(JSON.stringify({
        success: true,
        provider: providerName,
        email: userInfo.email || userInfo.emailAddress,
        account: userInfo.name || `${userInfo.firstName} ${userInfo.lastName}` || userInfo.username
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'checkStatus') {
      const { data: connection } = await supabaseClient
        .from('oauth_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .single();

      if (!connection) {
        return new Response(JSON.stringify({
          connected: false,
          message: `${provider} not connected`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const isExpired = connection.expires_at && new Date(connection.expires_at) < new Date();
      
      return new Response(JSON.stringify({
        connected: !isExpired,
        email: connection.email,
        account: connection.account_info?.name || connection.account_info?.email || connection.email,
        lastSync: connection.last_sync,
        message: isExpired ? 'Token expired, please reconnect' : `${provider} connected`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'disconnect') {
      await supabaseClient
        .from('oauth_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', provider);

      return new Response(JSON.stringify({
        success: true,
        message: `${provider} disconnected successfully`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'sync') {
      // Update last_sync timestamp
      await supabaseClient
        .from('oauth_connections')
        .update({ last_sync: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('provider', provider);

      return new Response(JSON.stringify({
        success: true,
        message: `${provider} data synced successfully`,
        lastSync: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    logger.error('Error in unified-oauth function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
