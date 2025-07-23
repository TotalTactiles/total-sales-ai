
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

    const { recordingId } = await req.json();

    // Get recording details
    const { data: recording, error: recordingError } = await supabaseClient
      .from('call_recordings')
      .select('*')
      .eq('id', recordingId)
      .single();

    if (recordingError || !recording) {
      throw new Error('Recording not found');
    }

    // Download audio file from Twilio
    const audioResponse = await fetch(recording.recording_url);
    const audioBuffer = await audioResponse.arrayBuffer();
    
    // Convert to base64 for OpenAI
    const audioBase64 = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    // Transcribe with OpenAI Whisper
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: audioBase64,
        model: 'whisper-1',
        response_format: 'verbose_json'
      })
    });

    const transcriptionData = await transcriptionResponse.json();

    // Update recording with transcription
    await supabaseClient
      .from('call_recordings')
      .update({
        transcription: transcriptionData.text,
        transcription_confidence: transcriptionData.confidence || 0.0
      })
      .eq('id', recordingId);

    return new Response(JSON.stringify({
      success: true,
      transcription: transcriptionData.text,
      confidence: transcriptionData.confidence
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
