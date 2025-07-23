
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
    
    const messageSid = params.get('MessageSid');
    const messageStatus = params.get('MessageStatus');
    const errorCode = params.get('ErrorCode');
    const errorMessage = params.get('ErrorMessage');

    console.log('SMS Status webhook:', { messageSid, messageStatus, errorCode });

    // Update SMS record
    const updateData: any = { status: messageStatus };
    
    if (errorCode || errorMessage) {
      updateData.error_message = errorMessage || `Error code: ${errorCode}`;
      updateData.status = 'failed';
    }

    const { error } = await supabaseClient
      .from('sms_conversations')
      .update(updateData)
      .eq('message_sid', messageSid);

    if (error) {
      console.error('Error updating SMS status:', error);
    }

    return new Response('OK', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('SMS status webhook error:', error);
    return new Response('Error', { status: 500 });
  }
});
