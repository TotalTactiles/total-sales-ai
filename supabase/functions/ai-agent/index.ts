
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// API Keys from environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// AI models
const MODELS = {
  GPT4O: 'gpt-4o',
  CLAUDE: 'claude-3-opus-20240229',
};

// Define task types that should use Claude instead of GPT-4o
const LONG_FORM_TASKS = ['training', 'sop', 'documentation', 'policy', 'script'];

// Helper function to determine if a prompt is for a long-form task
function isLongFormTask(prompt: string): boolean {
  return LONG_FORM_TASKS.some(task => 
    prompt.toLowerCase().includes(task.toLowerCase())
  );
}

// Helper function to fetch user data from Supabase
async function fetchUserData(userId: string) {
  try {
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { profile: null, stats: null, persona: null, confidence: [] };
    }

    // Fetch user stats
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError) {
      console.error('Error fetching user stats:', statsError);
    }

    // Fetch AI agent persona
    const { data: persona, error: personaError } = await supabase
      .from('ai_agent_personas')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (personaError) {
      console.error('Error fetching AI persona:', personaError);
    }

    // Fetch recent confidence cache entries (last 10)
    const { data: confidence, error: confidenceError } = await supabase
      .from('confidence_cache')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (confidenceError) {
      console.error('Error fetching confidence cache:', confidenceError);
    }

    return {
      profile,
      stats,
      persona,
      confidence: confidence || [],
    };
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    return { profile: null, stats: null, persona: null, confidence: [] };
  }
}

// OpenAI API call
async function callOpenAI(systemPrompt: string, userPrompt: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODELS.GPT4O,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

// Anthropic (Claude) API call
async function callClaude(systemPrompt: string, userPrompt: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${ANTHROPIC_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODELS.CLAUDE,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return JSON.parse(data.content[0].text);
  } catch (error) {
    console.error('Error calling Claude:', error);
    throw error;
  }
}

// Main function to handle requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, currentPersona, prompt } = await req.json();

    if (!userId || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing request for user ${userId}`);

    // Fetch user data from Supabase
    const userData = await fetchUserData(userId);

    // Build context for AI based on user data
    const userContext = {
      profile: userData.profile || {},
      stats: userData.stats || {},
      persona: userData.persona || currentPersona || {},
      recentActivity: userData.confidence || [],
    };

    // Create a system prompt enriched with user context
    const systemPrompt = `
      You are a highly effective AI sales assistant designed to help sales professionals succeed.
      
      USER CONTEXT:
      - Role: ${userContext.profile?.role || 'sales_rep'}
      - Name: ${userContext.profile?.full_name || 'User'}
      - Stats: Call count: ${userContext.stats?.call_count || 0}, Win count: ${userContext.stats?.win_count || 0}
      - Current streak: ${userContext.stats?.current_streak || 0}
      - Best time: ${userContext.stats?.best_time_start || 'unknown'} - ${userContext.stats?.best_time_end || 'unknown'}
      - Burnout risk: ${userContext.stats?.burnout_risk || 'Low'}
      - Mood score: ${userContext.stats?.mood_score || '5'}/10
      
      PERSONA SETTINGS:
      - Persona: ${userContext.persona?.name || 'AI Assistant'}
      - Tone: ${userContext.persona?.tone || 'Professional'}
      - Delivery style: ${userContext.persona?.delivery_style || 'Direct'}
      
      RECENT ACTIVITY:
      ${userContext.recentActivity.map((item: any) => 
        `- ${new Date(item.created_at).toLocaleDateString()}: ${item.win_description} ${item.objection_handled ? `(Objection handled: ${item.objection_handled})` : ''}`
      ).join('\n')}
      
      RESPONSE FORMAT:
      Your response MUST be valid JSON with two keys:
      1. "response": The main text response to the user's prompt
      2. "suggestedAction": An object with "type" and "details" for a recommended next action
      
      Action types can include: "schedule_call", "review_script", "send_email", "take_break", "practice_objection"
    `;

    let result;
    
    // Use Claude for long-form tasks, GPT-4o for everything else
    if (isLongFormTask(prompt)) {
      console.log('Using Claude for long-form task');
      result = await callClaude(systemPrompt, prompt);
    } else {
      console.log('Using GPT-4o for standard task');
      result = await callOpenAI(systemPrompt, prompt);
    }

    // Create a standardized response
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
