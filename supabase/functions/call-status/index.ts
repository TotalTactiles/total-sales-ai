import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logger } from '../../../src/utils/logger.ts';

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
    const callStatus = form.get('CallStatus')?.toString();
    const callDuration = form.get('CallDuration');

    if (!callSid || !callStatus) {
      throw new Error('Missing call SID or status');
    }

    await supabaseClient
      .from('call_logs')
      .update({
        status: callStatus,
        duration: callDuration ? Number(callDuration) : undefined,
      })
      .eq('call_sid', callSid);

    return new Response('OK', { headers: corsHeaders });
  } catch (error) {
    logger.error('Error in call-status webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
