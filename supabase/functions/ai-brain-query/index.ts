import { logger } from '../_shared/logger.ts';

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QueryContext {
  workspace: string;
  userId: string;
  userRole: string;
  workspaceData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, context }: { query: string; context: QueryContext } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(context);
    
    // Process the query with OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse response for actionable intents
    const actionableResponse = parseActionableResponse(aiResponse, context);

    return new Response(JSON.stringify({
      response: aiResponse,
      actions: actionableResponse.actions,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logger.error('AI brain query error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      response: "I'm having trouble processing that request right now. Please try again.",
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildSystemPrompt(context: QueryContext): string {
  const basePrompt = `You are Jarvis, an intelligent AI assistant for a sales CRM system. You help ${context.userRole}s with their daily tasks.`;
  
  let workspacePrompt = '';
  
  switch (context.workspace) {
    case 'dialer':
      workspacePrompt = `
        You're currently in the dialer workspace. You can help with:
        - Call preparation and scripts
        - Lead information and talking points
        - Call outcome logging
        - Next action recommendations
        ${context.workspaceData?.currentLead ? `Current lead: ${context.workspaceData.currentLead.name}` : ''}
        ${context.workspaceData?.isCallActive ? 'User is currently on a call.' : ''}
      `;
      break;
      
    case 'lead_details':
      workspacePrompt = `
        You're in the lead details workspace. You can help with:
        - Lead analysis and insights
        - Contact history review
        - Next best actions
        - Email and SMS drafting
        ${context.workspaceData?.currentLead ? `Current lead: ${context.workspaceData.currentLead.name}` : ''}
      `;
      break;
      
    case 'company_brain':
      workspacePrompt = `
        You're in the company knowledge management workspace. You can help with:
        - Data source management
        - Content organization
        - AI insights generation
        - Knowledge retrieval
      `;
      break;
      
    default:
      workspacePrompt = `
        You're in the general workspace. You can help with:
        - Task management
        - Performance insights
        - General CRM assistance
        - Navigation guidance
      `;
  }

  return `${basePrompt}\n\n${workspacePrompt}\n\nProvide concise, actionable responses. If you need more information to help effectively, ask specific questions.`;
}

function parseActionableResponse(response: string, context: QueryContext) {
  const actions: string[] = [];
  
  // Look for actionable keywords in the response
  if (response.toLowerCase().includes('call') || response.toLowerCase().includes('phone')) {
    actions.push('suggest_call');
  }
  
  if (response.toLowerCase().includes('email') || response.toLowerCase().includes('send')) {
    actions.push('draft_email');
  }
  
  if (response.toLowerCase().includes('meeting') || response.toLowerCase().includes('schedule')) {
    actions.push('schedule_meeting');
  }
  
  if (response.toLowerCase().includes('note') || response.toLowerCase().includes('log')) {
    actions.push('create_note');
  }

  return { actions };
}
