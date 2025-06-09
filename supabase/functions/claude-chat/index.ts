import { logger } from '../../../src/utils/logger.ts';

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');

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

    if (!claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        system: systemMessage || 'You are Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest. You are integrated into Total Tactiles OS to help with sales and business operations.',
        messages: [
          { role: 'user', content: prompt }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

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
    logger.error('Error in claude-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateContextualSuggestions(context: string, response: string): string[] {
  const baseSuggestions = [
    'Would you like me to analyze this further?',
    'Should I provide alternative approaches?',
    'Do you need implementation guidance?'
  ];

  const contextSuggestions = {
    lead_management: [
      'Should I analyze lead behavior patterns?',
      'Would you like conversion optimization tips?',
      'Should I suggest pipeline improvements?'
    ],
    academy: [
      'Would you like detailed learning modules?',
      'Should I create skill assessments?',
      'Do you need competency frameworks?'
    ],
    dashboard: [
      'Should I identify key performance drivers?',
      'Would you like benchmark comparisons?',
      'Do you need strategic recommendations?'
    ],
    analytics: [
      'Should I perform statistical analysis?',
      'Would you like correlation studies?',
      'Do you need forecasting models?'
    ]
  };

  return contextSuggestions[context as keyof typeof contextSuggestions] || baseSuggestions;
}

function generateSuggestedActions(context: string): string[] {
  const contextActions = {
    lead_management: [
      'Optimize pipeline',
      'Analyze patterns',
      'Improve conversion'
    ],
    academy: [
      'Design curriculum',
      'Create assessment',
      'Track progress'
    ],
    dashboard: [
      'Deep dive analysis',
      'Strategic planning',
      'Performance review'
    ],
    analytics: [
      'Build model',
      'Generate forecast',
      'Create insights'
    ]
  };

  return contextActions[context as keyof typeof contextActions] || [
    'Analyze deeper',
    'Get recommendations',
    'Take strategic action'
  ];
}
