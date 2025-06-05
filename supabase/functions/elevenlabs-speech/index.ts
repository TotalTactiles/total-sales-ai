import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpeechRequest {
  text?: string;
  voiceId?: string;
  model?: string;
  test?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voiceId = 'pNInz6obpgDQGcFmaJgB', model = 'eleven_multilingual_v2', test }: SpeechRequest = await req.json();

    if (test) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!text) {
      throw new Error('No text provided');
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${elevenLabsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('ElevenLabs API error');
    }

    const audioBuffer = await response.arrayBuffer();
    const fileName = `${crypto.randomUUID()}.mp3`;
    const filePath = `speech/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('public').upload(filePath, audioBuffer, {
      contentType: 'audio/mpeg',
    });
    if (uploadError) throw uploadError;

    const { data: signed, error: urlError } = await supabase.storage.from('public').createSignedUrl(filePath, 60 * 60);
    if (urlError) throw urlError;

    return new Response(JSON.stringify({ url: signed.signedUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in elevenlabs-speech function:', error);
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
