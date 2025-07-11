
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fromAI, toRepId, toAI, message, context, type, priority } = await req.json();

    const whisperId = await sendWhisper({
      fromAI,
      toRepId,
      toAI,
      message,
      context,
      type: type || 'rep_notification',
      priority: priority || 'medium'
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        whisperId,
        message: 'Whisper sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-whisper-send:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function sendWhisper(whisper: any): Promise<string> {
  const whisperId = crypto.randomUUID();
  
  // Log the whisper
  await supabase.from('ai_agent_tasks').insert({
    agent_type: whisper.fromAI,
    task_type: 'whisper_sent',
    company_id: 'system',
    status: 'completed',
    input_payload: {
      whisperId,
      toRepId: whisper.toRepId,
      toAI: whisper.toAI,
      type: whisper.type,
      priority: whisper.priority
    },
    output_payload: {
      message: whisper.message,
      context: whisper.context
    },
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString()
  });

  // If targeting a rep, create notification
  if (whisper.toRepId) {
    await supabase.from('ai_nudges').insert({
      company_id: 'system',
      rep_id: whisper.toRepId,
      nudge_type: whisper.type,
      title: `Message from ${whisper.fromAI.toUpperCase()} AI`,
      message: whisper.message,
      priority: getPriorityNumber(whisper.priority),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return whisperId;
}

function getPriorityNumber(priority: string): number {
  const priorityMap = { low: 1, medium: 2, high: 3, urgent: 4 };
  return priorityMap[priority as keyof typeof priorityMap] || 2;
}
