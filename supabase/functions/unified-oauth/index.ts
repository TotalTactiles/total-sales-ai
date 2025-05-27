
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
          const linkedinScopes = ['r_liteprofile', 'r_organization_social'].join(' ');
          
          authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
            `client_id=${Deno.env.get('LINKEDIN_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(linkedinScopes)}&` +
            `state=${user.id}_${provider}`;
          break;

        case 'facebook':
          const facebookScopes = ['pages_read_engagement', 'pages_show_list'].join(',');
          
          authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
            `client_id=${Deno.env.get('FACEBOOK_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${encodeURIComponent(facebookScopes)}&` +
            `state=${user.id}_${provider}`;
          break;

        case 'twitter':
          // Twitter OAuth 2.0 flow would go here
          authUrl = `https://twitter.com/i/oauth2/authorize?` +
            `client_id=${Deno.env.get('TWITTER_CLIENT_ID')}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=tweet.read%20users.read&` +
            `state=${user.id}_${provider}`;
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
        account: connection.account_info?.email || connection.email,
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

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in unified-oauth function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
