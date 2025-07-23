
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sessionId, supervisorId, type, supervisionId } = await req.json();

    // Get call session details
    const { data: session, error: sessionError } = await supabaseClient
      .from('call_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error('Call session not found');
    }

    // Twilio credentials
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioNumber) {
      throw new Error('Twilio credentials not configured');
    }

    // Get supervisor profile for phone number
    const { data: supervisor, error: supervisorError } = await supabaseClient
      .from('profiles')
      .select('phone_number')
      .eq('id', supervisorId)
      .single();

    if (supervisorError || !supervisor?.phone_number) {
      throw new Error('Supervisor phone number not found');
    }

    // Create Twilio conference call for supervision
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;
    const auth = btoa(`${accountSid}:${authToken}`);

    const supervisionCall = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: supervisor.phone_number,
        From: twilioNumber,
        Url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/supervision-webhook`,
        StatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/supervision-status`,
        StatusCallbackEvent: 'answered,completed'
      })
    });

    const supervisionData = await supervisionCall.json();

    if (!supervisionCall.ok) {
      throw new Error(`Twilio error: ${supervisionData.message}`);
    }

    // Update supervision record with call SID
    await supabaseClient
      .from('call_supervision')
      .update({
        metadata: {
          supervision_call_sid: supervisionData.sid,
          original_call_sid: session.call_sid,
          supervision_type: type
        }
      })
      .eq('id', supervisionId);

    // Create call event
    await supabaseClient
      .from('call_events')
      .insert({
        call_session_id: sessionId,
        event_type: 'supervision_start',
        event_data: {
          supervisor_id: supervisorId,
          supervision_type: type,
          supervision_call_sid: supervisionData.sid
        }
      });

    return new Response(JSON.stringify({
      success: true,
      supervisionCallSid: supervisionData.sid
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Supervision start error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
