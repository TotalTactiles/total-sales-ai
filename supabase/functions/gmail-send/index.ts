
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
  leadId: string
  leadName: string
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
      throw new Error('Gmail not connected')
    }

    // Create email message
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      body
    ].join('\r\n')

    const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

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
      throw new Error(`Gmail API error: ${gmailData.error?.message}`)
    }

    // Log email in database
    await supabaseClient
      .from('usage_events')
      .insert({
        user_id: user.id,
        company_id: (await supabaseClient.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id,
        feature: 'email_send',
        action: 'sent',
        context: `lead_${leadId}`,
        metadata: {
          leadName,
          to,
          subject,
          messageId: gmailData.id,
          provider: 'gmail'
        }
      })

    return new Response(JSON.stringify({
      success: true,
      messageId: gmailData.id,
      message: `Email sent to ${leadName}`
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
