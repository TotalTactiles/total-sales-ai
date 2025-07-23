
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

    const { type, leadId, userId, companyId, content, metadata } = await req.json();

    // Create communication record
    const { data: comm, error: commError } = await supabaseClient
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        user_id: userId,
        company_id: companyId,
        type,
        content,
        metadata,
        direction: 'outbound',
        status: 'sent'
      })
      .select()
      .single();

    if (commError) {
      throw new Error(`Failed to create communication record: ${commError.message}`);
    }

    // Update lead with last communication
    await supabaseClient
      .from('leads')
      .update({
        last_contact: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);

    // Send actual communication based on type
    if (type === 'sms') {
      // Send SMS via Twilio
      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
      const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

      if (accountSid && authToken && twilioNumber) {
        const smsUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const auth = btoa(`${accountSid}:${authToken}`);

        const formData = new URLSearchParams({
          To: metadata?.phone || '',
          From: twilioNumber,
          Body: content
        });

        await fetch(smsUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData
        });
      }
    } else if (type === 'email') {
      // Send email via your email service
      // Implementation depends on your email provider
    }

    return new Response(JSON.stringify({
      success: true,
      communicationId: comm.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Communication error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
