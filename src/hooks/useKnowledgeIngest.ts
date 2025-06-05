import { logger } from '@/utils/logger';

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

    // Get the user's company_id from their profile
    let companyId = params.companyId;
    
    if (!companyId) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          logger.error("Error fetching user's company_id:", profileError);
        } else if (profileData) {
          companyId = profileData.company_id;
        }
      } catch (err) {
        logger.error("Exception when fetching user's company_id:", err);
      }
    }

    setIsIngesting(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-brain-ingest', {
        body: {
          companyId,
          industry: params.industry,
          sourceType: params.sourceType,
          sourceId: params.sourceId,
          text: params.text
        }
      });

      if (error) {
        logger.error("Error ingesting to AI Brain:", error);
        setError(error.message || "Error communicating with AI Brain");
        toast.error("Failed to ingest data to AI Brain");
        return null;
      }

      toast.success(`Successfully processed ${data.chunks_success} of ${data.chunks_total} chunks`);
      return data;
      
    } catch (err: any) {
      logger.error("Exception when ingesting to AI Brain:", err);
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

    // Get the user's company_id from their profile
    let companyId;
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        logger.error("Error fetching user's company_id:", profileError);
      } else if (profileData) {
        companyId = profileData.company_id;
      }
    } catch (err) {
      logger.error("Exception when fetching user's company_id:", err);
    }

    setIsIngesting(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-brain-crawl', {
        body: {
          url,
          industry,
          sourceType,
          companyId,
          userId: user.id // Still pass userId as a fallback
        }
      });

      if (error) {
        logger.error("Error crawling web content:", error);
        setError(error.message || "Error crawling web content");
        toast.error("Failed to crawl web content");
        return null;
      }

      toast.success(`Successfully processed ${data.chunks_success} chunks from web content`);
      return data;
      
    } catch (err: any) {
      logger.error("Exception when crawling web content:", err);
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
