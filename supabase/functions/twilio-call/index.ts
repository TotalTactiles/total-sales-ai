import { logger } from '../../../src/utils/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CallRequest {
  to: string
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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { to, leadId, leadName, userId }: CallRequest = await req.json()

    // Twilio credentials from environment
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials not configured')
    }

    // Make Twilio API call
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`
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
        Url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-webhook`,
        StatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/call-status`,
        Record: 'true',
        RecordingStatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/recording-status`
      })
    })

    const twilioData = await response.json()

    if (!response.ok) {
      throw new Error(`Twilio error: ${twilioData.message}`)
    }

    // Log call attempt in database
    await supabaseClient
      .from('usage_events')
      .insert({
        user_id: userId,
        company_id: (await supabaseClient.from('profiles').select('company_id').eq('id', userId).single()).data?.company_id,
        feature: 'phone_call',
        action: 'initiated',
        context: `lead_${leadId}`,
        metadata: {
          leadName,
          phoneNumber: to,
          callSid: twilioData.sid,
          provider: 'twilio'
        }
      })

    return new Response(JSON.stringify({
      success: true,
      callSid: twilioData.sid,
      status: twilioData.status,
      message: `Call initiated to ${leadName}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in twilio-call function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
