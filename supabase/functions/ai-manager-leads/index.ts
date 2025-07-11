
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const response = await processLeadsAIQuery(query, context, userId, companyId);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-manager-leads:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        response: 'I apologize, but I encountered an error analyzing your leads. Please try again.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processLeadsAIQuery(query: string, context: any, userId?: string, companyId?: string) {
  // Leads AI logic
  const mockResponse = {
    success: true,
    response: generateLeadsResponse(query, context),
    insights: {
      totalLeads: context?.leads?.length || 24,
      qualifiedRate: 67,
      conversionPrediction: 23,
      stalledLeads: 3,
      hotLeads: 8
    },
    actions: [
      'Follow up with stalled leads',
      'Prioritize hot prospects',
      'Review lead scoring model'
    ],
    chartData: generateLeadsChart(query, context)
  };

  // Check for alerts to send to CEO EA
  if (mockResponse.insights.stalledLeads > 2) {
    // This would trigger a whisper to CEO EA AI about stalled leads
    console.log('Alert: High number of stalled leads detected');
  }

  return mockResponse;
}

function generateLeadsResponse(query: string, context: any): string {
  const responses = {
    'score': 'Lead scoring analysis: 67% of new leads match your ideal customer profile. Top scoring leads are from enterprise segment.',
    'stalled': 'You have 3 stalled leads that need immediate attention. I recommend reaching out with a different value proposition.',
    'predict': 'Conversion prediction: Based on current pipeline, you\'re likely to close 23% of active leads this month.',
    'assign': 'Reassignment recommendation: Move the enterprise leads to Sarah (87% close rate) and SMB leads to Mike (strong relationship builder).'
  };

  for (const [key, response] of Object.entries(responses)) {
    if (query.toLowerCase().includes(key)) {
      return response;
    }
  }

  return 'I can help you analyze lead scoring, predict conversions, identify stalled opportunities, and suggest optimal reassignments. What would you like to explore?';
}

function generateLeadsChart(query: string, context: any) {
  if (query.toLowerCase().includes('chart') || query.toLowerCase().includes('conversion')) {
    return {
      type: 'bar',
      data: {
        labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed'],
        datasets: [{
          label: 'Lead Count',
          data: [45, 32, 18, 12, 8],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ]
        }]
      },
      config: {
        title: 'Lead Pipeline Distribution'
      }
    };
  }
  return null;
}
