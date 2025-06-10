
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

async function executeWorkflow(data: any) {
  const { workflowId, input, userId } = data;

  // Check usage limits
  const { data: user } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single();

  if (!profile) throw new Error('Profile not found');

  const { data: usage } = await supabase
    .from('relevance_usage')
    .select('*')
    .eq('company_id', profile.company_id)
    .single();

  if (usage && usage.requests_used >= usage.requests_limit) {
    throw new Error('Usage limit exceeded');
  }

  // Execute workflow with Relevance AI
  const response = await fetch(`https://api.relevanceai.com/v1/workflows/${workflowId}/execute`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${relevanceApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input })
  });

  if (!response.ok) {
    throw new Error(`Workflow execution failed: ${response.statusText}`);
  }

  const result = await response.json();

  // Update usage stats
  await supabase
    .from('relevance_usage')
    .upsert({
      company_id: profile.company_id,
      requests_used: (usage?.requests_used || 0) + 1,
      tier: usage?.tier || 'Basic',
      updated_at: new Date().toISOString()
    });

  return new Response(
    JSON.stringify({ success: true, result }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateResponse(data: any) {
  const { prompt, context, userId } = data;

  // Check usage and execute similar to workflow
  const response = await fetch('https://api.relevanceai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${relevanceApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      context,
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`AI response generation failed: ${response.statusText}`);
  }

  const result = await response.json();

  return new Response(
    JSON.stringify({ content: result.content }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function listWorkflows() {
  const response = await fetch('https://api.relevanceai.com/v1/workflows', {
    headers: {
      'Authorization': `Bearer ${relevanceApiKey}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to list workflows: ${response.statusText}`);
  }

  const result = await response.json();

  return new Response(
    JSON.stringify({ workflows: result.workflows || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createWorkflow(data: any) {
  const response = await fetch('https://api.relevanceai.com/v1/workflows', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${relevanceApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to create workflow: ${response.statusText}`);
  }

  const result = await response.json();

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
