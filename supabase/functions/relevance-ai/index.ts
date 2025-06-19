
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const relevanceApiKey = Deno.env.get('RELEVANCE_AI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    switch (action) {
      case 'health_check':
        return await healthCheck();
      case 'agent_health_check':
        return await agentHealthCheck(data);
      case 'execute_workflow':
        return await executeWorkflow(data);
      case 'generate_response':
        return await generateResponse(data);
      case 'list_workflows':
        return await listWorkflows();
      case 'create_workflow':
        return await createWorkflow(data);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in relevance-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function healthCheck() {
  try {
    // Simple health check that always returns success
    return new Response(
      JSON.stringify({ 
        success: true, 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'Relevance AI function is operational'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
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
}

async function agentHealthCheck(data: any) {
  try {
    const { agentId } = data;
    
    // Simulate agent health check
    const isHealthy = Math.random() > 0.1; // 90% success rate
    
    if (!isHealthy) {
      throw new Error(`Agent ${agentId} is experiencing issues`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        agentId,
        status: 'active',
        responseTime: Math.floor(Math.random() * 1000) + 200,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
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
}

async function executeWorkflow(data: any) {
  const { workflowId, input, userId } = data;

  try {
    // Check usage limits
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user && !userId) {
      throw new Error('Authentication required');
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId || authData.user?.id)
      .single();

    if (!profile) {
      console.warn('Profile not found, proceeding with mock execution');
    }

    // Check or create usage tracking
    if (profile?.company_id) {
      const { data: usage } = await supabase
        .from('relevance_usage')
        .select('*')
        .eq('company_id', profile.company_id)
        .single();

      if (usage && usage.requests_used >= usage.requests_limit) {
        throw new Error('Usage limit exceeded');
      }

      // Update usage stats
      await supabase
        .from('relevance_usage')
        .upsert({
          company_id: profile.company_id,
          requests_used: (usage?.requests_used || 0) + 1,
          tier: usage?.tier || 'Basic',
          updated_at: new Date().toISOString()
        });
    }

    // Execute workflow - for now, return mock responses based on agent type
    let result;
    
    switch (workflowId) {
      case 'salesAgent_v1':
        result = await executeSalesAgent(input);
        break;
      case 'managerAgent_v1':
        result = await executeManagerAgent(input);
        break;
      case 'automationAgent_v1':
        result = await executeAutomationAgent(input);
        break;
      case 'developerAgent_v1':
        result = await executeDeveloperAgent(input);
        break;
      default:
        result = {
          success: true,
          message: `Workflow ${workflowId} executed successfully`,
          output: `Mock output for ${input.taskType}`,
          timestamp: new Date().toISOString()
        };
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Workflow execution error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function executeSalesAgent(input: any) {
  const { taskType, context } = input;
  
  switch (taskType) {
    case 'lead_analysis':
      return {
        summary: 'Lead analysis completed',
        score: Math.floor(Math.random() * 100),
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        recommended_actions: ['Call within 1 hour', 'Send follow-up email', 'Schedule demo'],
        confidence: 0.85
      };
    
    case 'follow_up_generation':
      return {
        email_subject: 'Following up on your interest',
        email_body: 'Hi [Name], I wanted to follow up on our previous conversation...',
        call_script: 'Hi [Name], this is [Rep] calling to follow up...',
        timing: 'within 24 hours'
      };
    
    case 'call_summary':
      return {
        summary: 'Call completed successfully with positive outcome',
        sentiment: 'positive',
        next_steps: ['Send proposal', 'Schedule follow-up meeting'],
        outcome: 'qualified'
      };
    
    default:
      return {
        success: true,
        message: `Sales agent task ${taskType} completed`,
        output: 'Mock sales agent response'
      };
  }
}

async function executeManagerAgent(input: any) {
  const { taskType } = input;
  
  return {
    success: true,
    message: `Manager agent task ${taskType} completed`,
    insights: ['Team performance is above average', 'Consider additional training for objection handling'],
    recommendations: ['Increase call volume', 'Focus on high-value leads'],
    metrics: {
      team_performance: 85,
      individual_scores: [78, 92, 85, 90]
    }
  };
}

async function executeAutomationAgent(input: any) {
  const { taskType } = input;
  
  return {
    success: true,
    message: `Automation task ${taskType} completed`,
    actions_taken: ['Email sent', 'CRM updated', 'Follow-up scheduled'],
    next_automation: 'follow_up_in_3_days'
  };
}

async function executeDeveloperAgent(input: any) {
  const { taskType } = input;
  
  return {
    success: true,
    message: `Developer agent task ${taskType} completed`,
    system_status: 'healthy',
    issues_found: 0,
    recommendations: ['System operating normally']
  };
}

async function generateResponse(data: any) {
  const { prompt, context, userId } = data;

  try {
    // Mock AI response generation
    const responses = [
      "Based on your query, I recommend focusing on lead qualification and follow-up timing.",
      "Here's my analysis of the current situation and suggested next steps.",
      "I've reviewed the data and found several opportunities for improvement.",
      "Your metrics look good. Consider implementing these optimization strategies."
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    return new Response(
      JSON.stringify({ content: response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function listWorkflows() {
  const workflows = [
    { id: 'salesAgent_v1', name: 'Sales Agent', status: 'active' },
    { id: 'managerAgent_v1', name: 'Manager Agent', status: 'active' },
    { id: 'automationAgent_v1', name: 'Automation Agent', status: 'active' },
    { id: 'developerAgent_v1', name: 'Developer Agent', status: 'active' }
  ];

  return new Response(
    JSON.stringify({ workflows }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createWorkflow(data: any) {
  // Mock workflow creation
  return new Response(
    JSON.stringify({ 
      success: true, 
      workflowId: `workflow_${Date.now()}`,
      message: 'Workflow created successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
