
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

    // Get recording with transcription
    const { data: recording, error: recordingError } = await supabaseClient
      .from('call_recordings')
      .select('*')
      .eq('id', recordingId)
      .single();

    if (recordingError || !recording || !recording.transcription) {
      throw new Error('Recording or transcription not found');
    }

    // Analyze with OpenAI
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a call analysis expert. Analyze the call transcription and provide sentiment analysis, key topics, action items, and overall quality score.'
          },
          {
            role: 'user',
            content: `Analyze this call transcription and provide a structured analysis:\n\n${recording.transcription}`
          }
        ],
        functions: [
          {
            name: 'analyze_call',
            parameters: {
              type: 'object',
              properties: {
                sentiment: {
                  type: 'object',
                  properties: {
                    overall: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
                    score: { type: 'number', minimum: -1, maximum: 1 },
                    customer_sentiment: { type: 'string' },
                    agent_sentiment: { type: 'string' }
                  }
                },
                key_topics: {
                  type: 'array',
                  items: { type: 'string' }
                },
                action_items: {
                  type: 'array',
                  items: { type: 'string' }
                },
                quality_metrics: {
                  type: 'object',
                  properties: {
                    clarity: { type: 'number', minimum: 1, maximum: 10 },
                    professionalism: { type: 'number', minimum: 1, maximum: 10 },
                    resolution: { type: 'number', minimum: 1, maximum: 10 },
                    overall_score: { type: 'number', minimum: 1, maximum: 10 }
                  }
                },
                keywords: {
                  type: 'array',
                  items: { type: 'string' }
                },
                summary: { type: 'string' }
              }
            }
          }
        ],
        function_call: { name: 'analyze_call' }
      })
    });

    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.function_call.arguments);

    // Update recording with analysis
    await supabaseClient
      .from('call_recordings')
      .update({
        sentiment_analysis: analysis.sentiment,
        keywords: analysis.keywords
      })
      .eq('id', recordingId);

    // Update call session with quality score
    await supabaseClient
      .from('call_sessions')
      .update({
        quality_score: analysis.quality_metrics.overall_score,
        sentiment_score: analysis.sentiment.score
      })
      .eq('id', recording.call_session_id);

    return new Response(JSON.stringify({
      success: true,
      analysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
