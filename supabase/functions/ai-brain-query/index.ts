
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIKey = Deno.env.get('OPENAI_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to get embeddings from OpenAI
async function getEmbedding(query: string): Promise<number[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: query,
      }),
    });

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].embedding) {
      console.error('Invalid response from OpenAI embeddings API:', data);
      throw new Error('Invalid response from OpenAI embeddings API');
    }
    
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, industry, query, topK = 5 } = await req.json();

    // Validate input
    if (!industry || !query) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get embedding for query
    const embedding = await getEmbedding(query);
    
    // Use the database function for vector search
    const { data, error } = await supabase.rpc(
      'execute_vector_search',
      {
        query_embedding: embedding,
        company_filter: companyId,
        industry_filter: industry,
        match_limit: topK,
      }
    );
    
    if (error) {
      console.error('Error executing vector search:', error);
      
      // Fallback to manual search if the function fails
      let fallbackResults;
      
      // Try company-specific search
      if (companyId) {
        const { data: companyData, error: companyError } = await supabase
          .from('industry_knowledge')
          .select('content, source_type, source_id')
          .eq('company_id', companyId)
          .eq('industry', industry)
          .order('embedding <-> $1', { ascending: true })
          .limit(topK)
          .values([embedding]);
          
        if (!companyError) {
          fallbackResults = companyData;
        } else {
          console.error('Fallback company search failed:', companyError);
        }
      }
      
      // Try industry-wide search if needed
      if (!fallbackResults || fallbackResults.length < topK) {
        const remainingCount = topK - (fallbackResults?.length || 0);
        
        const { data: industryData, error: industryError } = await supabase
          .from('industry_knowledge')
          .select('content, source_type, source_id')
          .is('company_id', null)
          .eq('industry', industry)
          .order('embedding <-> $1', { ascending: true })
          .limit(remainingCount)
          .values([embedding]);
          
        if (!industryError) {
          fallbackResults = [...(fallbackResults || []), ...(industryData || [])];
        } else {
          console.error('Fallback industry search failed:', industryError);
        }
      }
      
      if (fallbackResults) {
        return new Response(
          JSON.stringify({ results: fallbackResults }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to execute vector search' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ results: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI Brain query function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
