
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

    const body = await req.text();
    const params = new URLSearchParams(body);
    
    const callSid = params.get('CallSid');
    const callStatus = params.get('CallStatus');
    const from = params.get('From');
    const to = params.get('To');
    const duration = params.get('CallDuration');
    const recordingUrl = params.get('RecordingUrl');
    const recordingSid = params.get('RecordingSid');

    console.log('Webhook received:', { callSid, callStatus, from, to });

    // Find existing call session
    const { data: session, error: sessionError } = await supabaseClient
      .from('call_sessions')
      .select('*')
      .eq('call_sid', callSid)
      .single();

    if (sessionError && sessionError.code !== 'PGRST116') {
      console.error('Error finding call session:', sessionError);
      return new Response('Error', { status: 500 });
    }

    // Update call session status
    const statusMap = {
      'initiated': 'initiated',
      'ringing': 'ringing',
      'in-progress': 'answered',
      'completed': 'completed',
      'failed': 'failed',
      'busy': 'failed',
      'no-answer': 'failed',
      'canceled': 'cancelled'
    };

    const mappedStatus = statusMap[callStatus] || callStatus;
    const updateData: any = { status: mappedStatus };

    if (callStatus === 'in-progress' && !session?.answered_at) {
      updateData.answered_at = new Date().toISOString();
    }

    if (callStatus === 'completed') {
      updateData.ended_at = new Date().toISOString();
      if (duration) {
        updateData.duration = parseInt(duration);
      }
      if (recordingUrl) {
        updateData.recording_url = recordingUrl;
      }
      if (recordingSid) {
        updateData.recording_sid = recordingSid;
      }
    }

    if (session) {
      const { error: updateError } = await supabaseClient
        .from('call_sessions')
        .update(updateData)
        .eq('call_sid', callSid);

      if (updateError) {
        console.error('Error updating call session:', updateError);
      }

      // Create call event
      await supabaseClient
        .from('call_events')
        .insert({
          call_session_id: session.id,
          event_type: callStatus === 'ringing' ? 'ring' : 
                     callStatus === 'in-progress' ? 'answer' : 
                     callStatus === 'completed' ? 'hangup' : 'dial',
          event_data: {
            from,
            to,
            duration,
            recordingUrl,
            recordingSid
          }
        });
    }

    // Generate TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling. Please hold while we connect you.</Say>
  <Dial timeout="30" record="true">
    <Number>${to}</Number>
  </Dial>
</Response>`;

    return new Response(twiml, {
      headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
});
