import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { logger } from '../../../src/utils/logger.ts';

// API Keys from environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

// Configure CORS allowed origins via env variable
const allowedOrigins = (Deno.env.get('CORS_ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// AI models
const MODELS = {
  GPT4O: 'gpt-4o',
  GPT4O_MINI: 'gpt-4o-mini',
  CLAUDE_OPUS: 'claude-3-opus-20240229',
  CLAUDE_SONNET: 'claude-3-sonnet-20240229',
};

// Define task types that should use Claude instead of GPT-4o
const CLAUDE_PREFERRED_TASKS = [
  'training', 'sop', 'documentation', 'policy', 'script', 'strategy',
  'analyze', 'explain', 'write', 'draft', 'create', 'complex',
  'detailed', 'comprehensive', 'elaborate', 'nuanced'
];

// Helper function to determine if a prompt is better suited for Claude
function shouldUseClaude(prompt: string, provider?: string): boolean {
  if (provider === 'anthropic') return true;
  if (provider === 'openai') return false;
  
  const promptLower = prompt.toLowerCase();
  return CLAUDE_PREFERRED_TASKS.some(task => 
    promptLower.includes(task.toLowerCase())
  ) || prompt.length > 500;
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

// OpenAI API call with fallback handling
async function callOpenAI(systemPrompt: string, userPrompt: string, model = MODELS.GPT4O) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
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
      
      // Check for quota exceeded error
      if (response.status === 429 || errorText.includes('quota')) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return {
      response: JSON.parse(data.choices[0].message.content),
      model: model,
      provider: 'openai',
      usage: data.usage
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // If quota exceeded, don't retry with OpenAI
    if (error.message === 'QUOTA_EXCEEDED') {
      throw new Error('OPENAI_QUOTA_EXCEEDED');
    }
    
    throw error;
  }
}

// Anthropic (Claude) API call
async function callClaude(systemPrompt: string, userPrompt: string, model = MODELS.CLAUDE_OPUS) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${ANTHROPIC_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
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
    
    // Try to parse as JSON, fallback to plain text
    let responseContent;
    try {
      responseContent = JSON.parse(data.content[0].text);
    } catch {
      responseContent = { response: data.content[0].text };
    }
    
    return {
      response: responseContent,
      model: model,
      provider: 'anthropic',
      usage: data.usage
    };
  } catch (error) {
    console.error('Error calling Claude:', error);
    throw error;
  }
}

// Intelligent AI routing with fallback
async function callAIWithFallback(systemPrompt: string, userPrompt: string, preferredProvider?: string) {
  const useClaude = shouldUseClaude(userPrompt, preferredProvider);
  
  try {
    if (useClaude && ANTHROPIC_API_KEY) {
      console.log('Using Claude for complex/long-form task');
      return await callClaude(systemPrompt, userPrompt);
    } else if (OPENAI_API_KEY) {
      console.log('Using OpenAI for standard task');
      return await callOpenAI(systemPrompt, userPrompt);
    } else {
      throw new Error('No AI API keys configured');
    }
  } catch (error) {
    console.warn(`Primary AI service failed: ${error.message}`);
    
    // Fallback logic
    if (error.message === 'OPENAI_QUOTA_EXCEEDED' && ANTHROPIC_API_KEY) {
      console.log('OpenAI quota exceeded, falling back to Claude');
      return await callClaude(systemPrompt, userPrompt);
    } else if (useClaude && OPENAI_API_KEY && !error.message.includes('QUOTA')) {
      console.log('Claude failed, falling back to OpenAI');
      return await callOpenAI(systemPrompt, userPrompt);
    }
    
    throw error;
  }
}

// Main function to handle requests
serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin':
      allowedOrigins.length === 0
        ? '*'
        : allowedOrigins.includes(req.headers.get('origin') ?? '')
        ? req.headers.get('origin') ?? ''
        : allowedOrigins[0] ?? '',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
  };
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, currentPersona, prompt, systemPrompt, model, provider } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required prompt parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing request${userId ? ` for user ${userId}` : ''} with provider preference: ${provider || 'auto'}`);

    // Fetch user data if userId provided
    let userData = { profile: {}, stats: {}, persona: {}, recentActivity: [] };
    if (userId) {
      userData = await fetchUserData(userId);
    }

    // Build enhanced system prompt with user context
    const enhancedSystemPrompt = systemPrompt || `
      You are a highly effective AI sales assistant designed to help sales professionals succeed.
      
      ${userId ? `USER CONTEXT:
      - Role: ${userData.profile?.role || 'sales_rep'}
      - Name: ${userData.profile?.full_name || 'User'}
      - Stats: Call count: ${userData.stats?.call_count || 0}, Win count: ${userData.stats?.win_count || 0}
      - Current streak: ${userData.stats?.current_streak || 0}
      - Best time: ${userData.stats?.best_time_start || 'unknown'} - ${userData.stats?.best_time_end || 'unknown'}
      - Burnout risk: ${userData.stats?.burnout_risk || 'Low'}
      - Mood score: ${userData.stats?.mood_score || '5'}/10
      
      PERSONA SETTINGS:
      - Persona: ${userData.persona?.name || currentPersona?.name || 'AI Assistant'}
      - Tone: ${userData.persona?.tone || currentPersona?.tone || 'Professional'}
      - Delivery style: ${userData.persona?.delivery_style || currentPersona?.delivery_style || 'Direct'}` : ''}
      
      RESPONSE FORMAT:
      Your response MUST be valid JSON with two keys:
      1. "response": The main text response to the user's prompt
      2. "suggestedAction": An object with "type" and "details" for a recommended next action
      
      Action types can include: "schedule_call", "review_script", "send_email", "take_break", "practice_objection"
    `;

    // Call AI with intelligent routing and fallback
    const result = await callAIWithFallback(enhancedSystemPrompt, prompt, provider);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    let errorMessage = 'AI services are temporarily unavailable. Please try again later.';
    
    if (error.message.includes('quota')) {
      errorMessage = 'AI service quota exceeded. Please try again later or contact support.';
    } else if (error.message.includes('API key')) {
      errorMessage = 'AI service configuration error. Please contact support.';
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
