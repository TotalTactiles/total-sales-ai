
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CallRequest {
  to: string;
  from?: string;
  leadId?: string;
  userId: string;
  companyId: string;
  direction: 'inbound' | 'outbound';
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { to, from, leadId, userId, companyId, direction, metadata }: CallRequest = await req.json();

    // Twilio credentials
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioNumber = from || Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioNumber) {
      throw new Error('Twilio credentials not configured');
    }

    // Create call session in database first
    const { data: session, error: sessionError } = await supabaseClient
      .from('call_sessions')
      .insert({
        call_sid: `temp_${Date.now()}`, // Will be updated when Twilio responds
        company_id: companyId,
        user_id: userId,
        lead_id: leadId,
        direction,
        status: 'initiated',
        from_number: direction === 'outbound' ? twilioNumber : to,
        to_number: direction === 'outbound' ? to : twilioNumber,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (sessionError) {
      throw new Error(`Failed to create call session: ${sessionError.message}`);
    }

    // Initiate Twilio call
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;
    const auth = btoa(`${accountSid}:${authToken}`);

    const formData = new URLSearchParams({
      To: to,
      From: twilioNumber,
      Url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-webhook-enhanced`,
      StatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-webhook-enhanced`,
      StatusCallbackEvent: 'initiated,ringing,answered,completed',
      Record: 'true',
      RecordingStatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/recording-status`,
      Timeout: '30'
    });

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const twilioData = await response.json();

    if (!response.ok) {
      throw new Error(`Twilio error: ${twilioData.message}`);
    }

    // Update call session with real Twilio SID
    await supabaseClient
      .from('call_sessions')
      .update({
        call_sid: twilioData.sid,
        status: 'initiated'
      })
      .eq('id', session.id);

    // Create initial call event
    await supabaseClient
      .from('call_events')
      .insert({
        call_session_id: session.id,
        event_type: 'dial',
        event_data: {
          twilioSid: twilioData.sid,
          status: twilioData.status,
          direction
        },
        user_id: userId
      });

    return new Response(JSON.stringify({
      success: true,
      callSid: twilioData.sid,
      sessionId: session.id,
      status: twilioData.status
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Call initiation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
