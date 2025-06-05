import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { encoding_for_model } from 'https://esm.sh/tiktoken-node@0.0.7';
import { logger } from '../../../src/utils/logger.ts';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIKey = Deno.env.get('OPENAI_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Basic function to extract text from HTML
function extractTextFromHTML(html: string): string {
  // Remove script and style sections
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                 .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Replace multiple spaces with a single space
  text = text.replace(/\s{2,}/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#039;/g, "'");
  
  return text.trim();
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
    console.error('Error creating chunks:', error);
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
    const { url, industry, sourceType, companyId, userId } = await req.json();

    // Validate input
    if (!url || !industry || !sourceType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Crawling URL: ${url} for company ID: ${companyId || 'null'}`);
    
    // If companyId is not provided but userId is, try to get the company_id from the user's profile
    let finalCompanyId = companyId;
    if (!finalCompanyId && userId) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData?.company_id) {
          finalCompanyId = profileData.company_id;
          console.log(`Retrieved company_id ${finalCompanyId} from user profile`);
        }
      } catch (err) {
        console.error('Failed to retrieve company_id from profile:', err);
      }
    }

    // Fetch the web content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    
    const html = await response.text();
    const text = extractTextFromHTML(html);
    
    if (!text) {
      throw new Error('No text content extracted from URL');
    }
    
    // Create chunks
    const chunks = createChunks(text);
    console.log(`Created ${chunks.length} chunks from URL content`);
    
    // Process each chunk
    const insertPromises = chunks.map(async (chunk, index) => {
      try {
        // Get embedding for the chunk
        const embedding = await getEmbedding(chunk);
        
        // Generate a unique ID for the source
        const sourceId = `${new URL(url).hostname}-${Date.now()}`;
        
        // Upsert into the industry_knowledge table
        const { error } = await supabase
          .from('industry_knowledge')
          .upsert({
            company_id: finalCompanyId,
            industry,
            source_type: sourceType,
            source_id: sourceId,
            content: chunk,
            embedding,
            metadata: {
              url: url,
              crawled_at: new Date().toISOString(),
            }
          });
        
        if (error) throw error;
        return { success: true, chunk_index: index };
      } catch (error) {
        console.error(`Error processing chunk ${index}:`, error);
        return { success: false, chunk_index: index, error };
      }
    });
    
    const results = await Promise.all(insertPromises);
    const successCount = results.filter(r => r.success).length;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${successCount} of ${chunks.length} chunks from URL`,
        chunks_total: chunks.length,
        chunks_success: successCount
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in web crawler function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
