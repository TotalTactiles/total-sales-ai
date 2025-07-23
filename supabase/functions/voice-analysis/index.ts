
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

    const { audioData, sessionId, userId } = await req.json();

    // Analyze audio for tone, pitch, and sentiment
    const analysis = {
      pitch: Math.random() * 100 + 50, // Mock pitch analysis
      tone: Math.random() * 100 + 30, // Mock tone analysis
      volume: Math.random() * 100 + 20, // Mock volume analysis
      sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
      confidence: Math.random() * 30 + 70,
      timestamp: new Date().toISOString()
    };

    // Store analysis in database
    await supabaseClient
      .from('call_events')
      .insert({
        call_session_id: sessionId,
        event_type: 'voice_analysis',
        event_data: analysis,
        user_id: userId
      });

    return new Response(JSON.stringify({
      success: true,
      analysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Voice analysis error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
