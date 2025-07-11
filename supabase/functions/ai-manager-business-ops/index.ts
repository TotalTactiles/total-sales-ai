
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

    const response = await processBusinessOpsAIQuery(query, context, userId, companyId);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-manager-business-ops:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        response: 'I apologize, but I encountered an error analyzing your business operations. Please try again.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processBusinessOpsAIQuery(query: string, context: any, userId?: string, companyId?: string) {
  // Business Operations AI logic
  const mockResponse = {
    success: true,
    response: generateBusinessOpsResponse(query, context),
    insights: {
      revenue: 2500000,
      costs: 1800000,
      profit: 700000,
      roas: 3.2,
      conversionRate: 4.8,
      customerAcquisitionCost: 150
    },
    chartData: generateBusinessOpsChart(query, context)
  };

  return mockResponse;
}

function generateBusinessOpsResponse(query: string, context: any): string {
  const responses = {
    'revenue': 'Revenue analysis: Current quarterly revenue is $2.5M, up 15% from last quarter. Strong performance in enterprise segment.',
    'costs': 'Cost analysis: Operating costs are well within budget at $1.8M. Recommend optimizing marketing spend for better ROAS.',
    'profit': 'Profit margins are healthy at 28%. Consider scaling successful campaigns to increase overall profitability.',
    'roas': 'Return on Ad Spend is 3.2x, which is above industry average. Focus on high-performing channels for better allocation.',
    'conversion': 'Conversion rate optimization: Current rate is 4.8%. A/B testing new landing pages could improve this by 15-20%.',
    'forecast': 'Revenue forecast: Based on current trends, we project $3.2M for next quarter with 95% confidence.',
    'scenario': 'Scenario simulation: If we increase ad spend by 25%, projected revenue uplift is 18% with acceptable risk levels.'
  };

  for (const [key, response] of Object.entries(responses)) {
    if (query.toLowerCase().includes(key)) {
      return response;
    }
  }

  return 'I can help you analyze revenue, costs, profitability, ROAS, conversion rates, and run scenario simulations. What specific metrics would you like to explore?';
}

function generateBusinessOpsChart(query: string, context: any) {
  if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('chart')) {
    return {
      type: 'line',
      data: [
        { month: 'Jan', revenue: 2000000, costs: 1500000 },
        { month: 'Feb', revenue: 2200000, costs: 1600000 },
        { month: 'Mar', revenue: 2500000, costs: 1800000 },
        { month: 'Apr', revenue: 2800000, costs: 1900000 },
        { month: 'May', revenue: 3200000, costs: 2100000 }
      ],
      datasets: [
        { dataKey: 'revenue', color: '#0088FE' },
        { dataKey: 'costs', color: '#FF8042' }
      ],
      config: {
        title: 'Revenue vs Costs Trend'
      }
    };
  }

  if (query.toLowerCase().includes('roas') || query.toLowerCase().includes('performance')) {
    return {
      type: 'scorecard',
      scores: [
        { label: 'ROAS', value: '3.2x', change: 8 },
        { label: 'Conversion Rate', value: '4.8%', change: 12 },
        { label: 'CAC', value: '$150', change: -5 },
        { label: 'LTV', value: '$2,400', change: 15 }
      ],
      config: {
        title: 'Key Performance Metrics'
      }
    };
  }

  return null;
}
