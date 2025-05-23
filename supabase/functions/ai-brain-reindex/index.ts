
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
async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text,
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

// Main function to re-index embeddings
async function reindexEmbeddings(): Promise<{ success: boolean; recordsProcessed: number; error?: string }> {
  try {
    // Get last run time from jobs table
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('last_run')
      .eq('job_name', 'ai_brain_reindex')
      .single();

    if (jobError) {
      throw new Error(`Error fetching job data: ${jobError.message}`);
    }

    const lastRun = jobData?.last_run || new Date(0).toISOString(); // Default to epoch if never run
    
    console.log(`Last reindex job run at: ${lastRun}`);
    
    // Get records created or updated since last run
    const { data: records, error: recordsError } = await supabase
      .from('industry_knowledge')
      .select('id, content')
      .gte('created_at', lastRun);
      
    if (recordsError) {
      throw new Error(`Error fetching records: ${recordsError.message}`);
    }
    
    console.log(`Found ${records?.length || 0} records to process`);
    
    // Process each record
    let successCount = 0;
    for (const record of records || []) {
      try {
        const embedding = await getEmbedding(record.content);
        
        const { error: updateError } = await supabase
          .from('industry_knowledge')
          .update({ embedding })
          .eq('id', record.id);
          
        if (updateError) {
          console.error(`Error updating embedding for record ${record.id}:`, updateError);
          continue;
        }
        
        successCount++;
      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error);
      }
    }
    
    // Update job status
    const now = new Date().toISOString();
    const metadata = {
      records_processed: successCount,
      run_at: now
    };
    
    const { error: updateJobError } = await supabase
      .from('jobs')
      .update({
        last_run: now,
        status: successCount === records?.length ? 'success' : 'partial_success',
        metadata
      })
      .eq('job_name', 'ai_brain_reindex');
      
    if (updateJobError) {
      console.error('Error updating job status:', updateJobError);
    }
    
    return {
      success: true,
      recordsProcessed: successCount
    };
  } catch (error) {
    console.error('Error in reindex job:', error);
    
    // Update job with error status
    try {
      const metadata = {
        error: error.message,
        run_at: new Date().toISOString()
      };
      
      await supabase
        .from('jobs')
        .update({
          status: 'error',
          metadata
        })
        .eq('job_name', 'ai_brain_reindex');
    } catch (e) {
      console.error('Error updating job error status:', e);
    }
    
    return {
      success: false,
      recordsProcessed: 0,
      error: error.message
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Run the reindex process
    const result = await reindexEmbeddings();
    
    return new Response(
      JSON.stringify(result),
      { status: result.success ? 200 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI Brain reindex function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
