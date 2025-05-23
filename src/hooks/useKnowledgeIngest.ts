
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from '@supabase/supabase-js';

interface IngestParams {
  companyId?: string;
  industry: string;
  sourceType: string;
  sourceId: string;
  text: string;
}

interface IngestResponse {
  success: boolean;
  message: string;
  chunks_total: number;
  chunks_success: number;
}

export function useKnowledgeIngest() {
  const [isIngesting, setIsIngesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ingestKnowledge = async (
    user: User | null, 
    params: IngestParams
  ): Promise<IngestResponse | null> => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Brain");
      toast.error("Authentication required to use AI Brain");
      return null;
    }

    setIsIngesting(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-brain-ingest', {
        body: {
          companyId: params.companyId,
          industry: params.industry,
          sourceType: params.sourceType,
          sourceId: params.sourceId,
          text: params.text
        }
      });

      if (error) {
        console.error("Error ingesting to AI Brain:", error);
        setError(error.message || "Error communicating with AI Brain");
        toast.error("Failed to ingest data to AI Brain");
        return null;
      }

      toast.success(`Successfully processed ${data.chunks_success} of ${data.chunks_total} chunks`);
      return data;
      
    } catch (err: any) {
      console.error("Exception when ingesting to AI Brain:", err);
      setError(err.message || "Unknown error occurred");
      toast.error("Failed to ingest data");
      return null;
    } finally {
      setIsIngesting(false);
    }
  };

  const crawlWebContent = async (
    user: User | null,
    url: string, 
    industry: string, 
    sourceType: string
  ): Promise<IngestResponse | null> => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Brain");
      toast.error("Authentication required to use AI Brain");
      return null;
    }

    setIsIngesting(true);
    setError(null);
    
    try {
      // Since there's an error with company_id not existing in profiles,
      // we'll make the crawl request without a company ID for now
      // This can be revised once the database schema is updated
      
      const { data, error } = await supabase.functions.invoke('ai-brain-crawl', {
        body: {
          url,
          industry,
          sourceType,
          // Omitting companyId for now as it's causing errors
          // If needed in the future, we'll need to update the profiles table schema
          userId: user.id // Pass userId instead, which can be used to determine company context
        }
      });

      if (error) {
        console.error("Error crawling web content:", error);
        setError(error.message || "Error crawling web content");
        toast.error("Failed to crawl web content");
        return null;
      }

      toast.success(`Successfully processed ${data.chunks_success} chunks from web content`);
      return data;
      
    } catch (err: any) {
      console.error("Exception when crawling web content:", err);
      setError(err.message || "Unknown error occurred");
      toast.error("Failed to crawl web content");
      return null;
    } finally {
      setIsIngesting(false);
    }
  };

  return {
    ingestKnowledge,
    crawlWebContent,
    isIngesting,
    error
  };
}
