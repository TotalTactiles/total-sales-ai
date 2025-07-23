
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSRequest {
  to: string;
  message: string;
  userId: string;
  companyId: string;
  leadId?: string;
  mediaUrls?: string[];
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

    const { to, message, userId, companyId, leadId, mediaUrls }: SMSRequest = await req.json();

    // Twilio credentials
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioNumber) {
      throw new Error('Twilio credentials not configured');
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = btoa(`${accountSid}:${authToken}`);

    const formData = new URLSearchParams({
      To: to,
      From: twilioNumber,
      Body: message,
      StatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/sms-status`
    });

    // Add media URLs if provided
    if (mediaUrls && mediaUrls.length > 0) {
      mediaUrls.forEach((url, index) => {
        formData.append(`MediaUrl${index}`, url);
      });
    }

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

    // Create SMS record in database
    const { data: smsRecord, error: smsError } = await supabaseClient
      .from('sms_conversations')
      .insert({
        company_id: companyId,
        user_id: userId,
        lead_id: leadId,
        phone_number: to,
        direction: 'outbound',
        message_sid: twilioData.sid,
        body: message,
        media_urls: mediaUrls || [],
        status: 'sent',
        metadata: {
          twilioStatus: twilioData.status,
          twilioSid: twilioData.sid
        }
      })
      .select()
      .single();

    if (smsError) {
      console.error('Error creating SMS record:', smsError);
    }

    return new Response(JSON.stringify({
      success: true,
      messageSid: twilioData.sid,
      status: twilioData.status,
      smsId: smsRecord?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('SMS send error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
