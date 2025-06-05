import { logger } from '../_shared/logger.ts';

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, systemMessage, context } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: systemMessage || 'You are a helpful AI assistant for Total Tactiles OS. Provide practical, actionable advice.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Generate contextual suggestions based on workspace
    const suggestions = generateContextualSuggestions(context, assistantMessage);
    const suggestedActions = generateSuggestedActions(context);

    return new Response(JSON.stringify({ 
      response: assistantMessage,
      suggestions,
      suggestedActions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error in openai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateContextualSuggestions(context: string, response: string): string[] {
  const baseSuggestions = [
    'Would you like me to elaborate on this?',
    'Should I provide specific steps?',
    'Do you need examples for this approach?'
  ];

  const contextSuggestions = {
    lead_management: [
      'Should I help create a follow-up sequence?',
      'Would you like lead scoring recommendations?',
      'Should I draft personalized outreach messages?'
    ],
    academy: [
      'Would you like practice exercises?',
      'Should I create a learning plan?',
      'Do you need assessment questions?'
    ],
    dashboard: [
      'Should I analyze your current metrics?',
      'Would you like performance comparisons?',
      'Do you need trend analysis?'
    ],
    analytics: [
      'Should I dive deeper into the data?',
      'Would you like predictive insights?',
      'Do you need visualization suggestions?'
    ]
  };

  return contextSuggestions[context as keyof typeof contextSuggestions] || baseSuggestions;
}

function generateSuggestedActions(context: string): string[] {
  const contextActions = {
    lead_management: [
      'Create follow-up task',
      'Schedule call',
      'Send email'
    ],
    academy: [
      'Take quiz',
      'Watch tutorial',
      'Practice scenario'
    ],
    dashboard: [
      'View detailed report',
      'Export data',
      'Set up alert'
    ],
    analytics: [
      'Generate report',
      'Create dashboard',
      'Share insights'
    ]
  };

  return contextActions[context as keyof typeof contextActions] || [
    'Get more help',
    'Ask follow-up',
    'Take action'
  ];
}
