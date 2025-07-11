
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

    const response = await processTeamAIQuery(query, context, userId, companyId);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-manager-team:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        response: 'I apologize, but I encountered an error analyzing your team performance. Please try again.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processTeamAIQuery(query: string, context: any, userId?: string, companyId?: string) {
  // Team AI logic with reward suggestions
  const mockResponse = {
    success: true,
    response: generateTeamResponse(query, context),
    insights: {
      teamSize: 8,
      topPerformer: 'Sarah Johnson',
      avgPerformance: 78,
      needsAttention: 2,
      rewardsSuggested: 3
    },
    rewards: generateRewardSuggestions(query, context),
    chartData: generateTeamChart(query, context)
  };

  // Check if we should send whispers to CEO EA about team issues
  if (mockResponse.insights.needsAttention > 1) {
    // This would trigger a whisper to CEO EA AI
    console.log('Alert: Multiple team members need attention');
  }

  return mockResponse;
}

function generateTeamResponse(query: string, context: any): string {
  const responses = {
    'performance': 'Team performance analysis: Average score is 78%. Sarah Johnson leads with 94%, while 2 members need coaching support.',
    'rewards': 'Reward recommendations: 3 team members qualify for recognition. Sarah for top performance, Mike for most improved, Lisa for team collaboration.',
    'coaching': 'Coaching insights: Focus on objection handling training for newer team members. Consider pairing them with top performers.',
    'motivation': 'Team motivation is solid at 82%. Recent wins have boosted morale. Continue celebrating small victories.',
    'productivity': 'Productivity metrics show 15% improvement this month. New tools are helping streamline workflows.',
    'training': 'Training needs analysis: Advanced sales techniques for 3 members, product knowledge refresh for 2 members.',
    'collaboration': 'Team collaboration score: 89%. Strong peer support network. Consider cross-training initiatives.'
  };

  for (const [key, response] of Object.entries(responses)) {
    if (query.toLowerCase().includes(key)) {
      return response;
    }
  }

  return 'I can analyze team performance, suggest rewards, identify coaching opportunities, and track motivation levels. What aspect of team management would you like to explore?';
}

function generateRewardSuggestions(query: string, context: any) {
  return [
    {
      repName: 'Sarah Johnson',
      reason: 'Top performer - 94% quota achievement',
      suggestedReward: 'Performance bonus + team recognition',
      priority: 'high'
    },
    {
      repName: 'Mike Chen',
      reason: 'Most improved - 40% increase in conversions',
      suggestedReward: 'Skill development course + certificate',
      priority: 'medium'
    },
    {
      repName: 'Lisa Park',
      reason: 'Best team collaboration and mentoring',
      suggestedReward: 'Team lead opportunity + public recognition',
      priority: 'medium'
    }
  ];
}

function generateTeamChart(query: string, context: any) {
  if (query.toLowerCase().includes('performance') || query.toLowerCase().includes('chart')) {
    return {
      type: 'bar',
      data: [
        { name: 'Sarah J.', performance: 94, quota: 100 },
        { name: 'Mike C.', performance: 87, quota: 100 },
        { name: 'Lisa P.', performance: 82, quota: 100 },
        { name: 'Tom R.', performance: 75, quota: 100 },
        { name: 'Amy K.', performance: 71, quota: 100 },
        { name: 'Joe B.', performance: 68, quota: 100 },
        { name: 'Emma L.', performance: 65, quota: 100 },
        { name: 'Dan M.', performance: 58, quota: 100 }
      ],
      datasets: [
        { dataKey: 'performance', color: '#0088FE' },
        { dataKey: 'quota', color: '#FF8042' }
      ],
      config: {
        title: 'Team Performance vs Quota'
      }
    };
  }

  if (query.toLowerCase().includes('rewards') || query.toLowerCase().includes('recognition')) {
    return {
      type: 'scorecard',
      scores: [
        { label: 'Top Performer', value: 'Sarah J.', change: null },
        { label: 'Most Improved', value: 'Mike C.', change: 40 },
        { label: 'Team Player', value: 'Lisa P.', change: null },
        { label: 'Needs Support', value: '2 members', change: null }
      ],
      config: {
        title: 'Team Recognition Dashboard'
      }
    };
  }

  return null;
}
