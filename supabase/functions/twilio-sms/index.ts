import { logger } from '../../../src/utils/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SMSRequest {
  to: string
  message: string
  leadId: string
  leadName: string
  userId: string
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

    const { to, message, leadId, leadName, userId }: SMSRequest = await req.json()

    // Twilio credentials
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials not configured')
    }

    // Add AU compliance footer
    const compliantMessage = `${message}\n\nReply STOP to unsubscribe.`

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: twilioPhoneNumber,
        Body: compliantMessage,
        StatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/sms-status`
      })
    })

    const twilioData = await response.json()

    if (!response.ok) {
      throw new Error(`Twilio SMS error: ${twilioData.message}`)
    }

    // Store SMS in database
    await supabaseClient
      .from('usage_events')
      .insert({
        user_id: userId,
        company_id: (await supabaseClient.from('profiles').select('company_id').eq('id', userId).single()).data?.company_id,
        feature: 'sms_send',
        action: 'sent',
        context: `lead_${leadId}`,
        metadata: {
          leadName,
          phoneNumber: to,
          message: compliantMessage,
          messageSid: twilioData.sid,
          provider: 'twilio'
        }
      })

    return new Response(JSON.stringify({
      success: true,
      messageSid: twilioData.sid,
      status: twilioData.status,
      message: `SMS sent to ${leadName}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in twilio-sms function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
