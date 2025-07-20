
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

    const form = await req.formData();
    const callSid = form.get('CallSid')?.toString();
    const recordingUrl = form.get('RecordingUrl')?.toString();

    if (!callSid) {
      throw new Error('Missing call SID');
    }

    await supabaseClient
      .from('call_logs')
      .update({ recording_url: recordingUrl ?? undefined })
      .eq('call_sid', callSid);

    return new Response('OK', { headers: corsHeaders });
  } catch (error) {
    console.error('Error in recording-status webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
