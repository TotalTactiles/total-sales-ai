
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { query, context, userId, companyId } = await req.json();

    // Initialize AI Processor
    const response = await processManagerDashboardQuery(query, context, userId, companyId);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-manager-dashboard:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        response: 'I apologize, but I encountered an error processing your request. Please try again.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processManagerDashboardQuery(query: string, context: any, userId?: string, companyId?: string) {
  // CEO EA AI logic
  const systemPrompt = `You are the CEO EA AI assistant for the Manager OS. 
  You provide executive summaries, handle alerts from other AI assistants, and conduct pulse checks.
  Always be concise, actionable, and executive-focused. 
  
  Available actions:
  - Generate executive summaries
  - Process alerts from other AIs
  - Conduct pulse checks
  - Create "Whisper to Rep" recommendations
  
  Respond in JSON format with: { response, insights, actions, whispers, chartData }`;

  // Mock response for now - replace with actual AI API call
  const mockResponse = {
    success: true,
    response: generateDashboardResponse(query, context),
    insights: {
      alertCount: 3,
      pulseCheckNeeded: false,
      teamMorale: 'high',
      criticalIssues: []
    },
    actions: [
      'Review quarterly projections',
      'Check team performance metrics',
      'Address stalled leads'
    ],
    whispers: generateWhisperRecommendations(context),
    chartData: generateDashboardChart(query)
  };

  return mockResponse;
}

function generateDashboardResponse(query: string, context: any): string {
  const responses = {
    'pulse check': 'All systems operating normally. Team performance up 8% this quarter. 3 alerts require attention.',
    'team status': 'Team is performing well. Sarah leads in conversions, Mike needs motivation support.',
    'alerts': 'You have 3 active alerts: 2 from Leads AI (stalled pipeline), 1 from Team AI (rep performance concern).',
    'overview': 'Executive Summary: Revenue tracking 12% above target. Team morale high. Lead pipeline healthy with 24 new qualified prospects this week.'
  };

  for (const [key, response] of Object.entries(responses)) {
    if (query.toLowerCase().includes(key)) {
      return response;
    }
  }

  return 'I\'m here to provide executive insights and manage alerts from your AI team. What would you like to know?';
}

function generateWhisperRecommendations(context: any) {
  return [
    {
      targetRepId: 'rep_123',
      message: 'Great job on the Johnson deal! Your persistence paid off.',
      context: { achievement: 'closed_deal', value: 15000 }
    },
    {
      targetRepId: 'rep_456', 
      message: 'The Thompson lead seems stalled. Consider a different approach?',
      context: { concern: 'stalled_lead', leadId: 'lead_789' }
    }
  ];
}

function generateDashboardChart(query: string) {
  if (query.toLowerCase().includes('chart') || query.toLowerCase().includes('graph')) {
    return {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [65000, 72000, 68000, 85000, 92000, 98000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      },
      config: {
        title: 'Revenue Trend - Last 6 Months'
      }
    };
  }
  return null;
}
