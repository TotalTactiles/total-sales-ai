import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { logger } from '../../../src/utils/logger.ts';
// Replace the missing tokenizer with tiktoken, which is available and maintained
import { encoding_for_model } from 'https://esm.sh/tiktoken-node@0.0.7';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIKey = Deno.env.get('OPENAI_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to remove PII (Personal Identifiable Information)
async function removePII(text: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a privacy protection tool that removes Personal Identifiable Information (PII) from text. Replace specific names, addresses, phone numbers, emails, and similar identifiable information with generic placeholders while preserving the meaning and context of the text.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    logger.error('Error removing PII:', error);
    return text; // Return original text if PII removal fails
  }
}

// Function to create text chunks (≤750 tokens each)
function createChunks(text: string, maxTokens = 750): string[] {
  try {
    // Use tiktoken encoding for text-embedding-ada-002 model
    const enc = encoding_for_model("text-embedding-ada-002");
    const tokens = enc.encode(text);
    const chunks: string[] = [];
    
    for (let i = 0; i < tokens.length; i += maxTokens) {
      const chunkTokens = tokens.slice(i, i + maxTokens);
      chunks.push(new TextDecoder().decode(enc.decode(chunkTokens)));
    }
    
    return chunks;
  } catch (error) {
    logger.error('Error creating chunks:', error);
    // Fallback to a simpler chunking method if tiktoken fails
    const approxCharsPerToken = 4; // Rough approximation
    const chunkSize = maxTokens * approxCharsPerToken;
    const chunks: string[] = [];
    
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    
    return chunks;
  }
}

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
    logger.error('Error creating embedding:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, industry, sourceType, sourceId, text } = await req.json();

    // Validate input
    if (!industry || !sourceType || !sourceId || !text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logger.info(`Processing ingest for company ID: ${companyId || 'null'}`);

    // Remove PII from the text
    const sanitizedText = await removePII(text);
    
    // Create chunks
    const chunks = createChunks(sanitizedText);
    
    logger.info(`Processing ${chunks.length} chunks for ingestion`);
    
    // Process each chunk
    const insertPromises = chunks.map(async (chunk, index) => {
      try {
        // Get embedding for the chunk
        const embedding = await getEmbedding(chunk);
        
        // Upsert into the industry_knowledge table
        const { error } = await supabase
          .from('industry_knowledge')
          .upsert({
            company_id: companyId || null,
            industry,
            source_type: sourceType,
            source_id: sourceId,
            content: chunk,
            embedding,
          });
        
        if (error) throw error;
        return { success: true, chunk_index: index };
      } catch (error) {
        logger.error(`Error processing chunk ${index}:`, error);
        return { success: false, chunk_index: index, error };
      }
    });
    
    const results = await Promise.all(insertPromises);
    const successCount = results.filter(r => r.success).length;
    
    // Update the stats_history table
    try {
      // Get the current document and chunk counts
      const { data: sourceData } = await supabase
        .from('industry_knowledge')
        .select('source_id', { count: 'exact', head: true })
        .not('source_id', 'is', null);

      const { count: chunkCount } = await supabase
        .from('industry_knowledge')
        .select('*', { count: 'exact', head: true });

      // Insert a new stats entry
      const { error: statsError } = await supabase
        .from('stats_history')
        .insert({
          document_count: sourceData?.length || 0,
          chunk_count: chunkCount || 0
        });

      if (statsError) {
        logger.error('Error inserting stats history:', statsError);
      }
    } catch (error) {
      logger.error('Error updating stats history:', error);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${successCount} of ${chunks.length} chunks`,
        chunks_total: chunks.length,
        chunks_success: successCount
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    logger.error('Error in AI Brain ingest function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
