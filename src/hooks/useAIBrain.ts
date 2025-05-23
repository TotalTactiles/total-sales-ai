
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

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

interface QueryParams {
  companyId?: string;
  industry: string;
  query: string;
  topK?: number;
}

interface KnowledgeResult {
  content: string;
  sourceType: string;
  sourceId: string;
}

interface ReindexResponse {
  success: boolean;
  recordsProcessed: number;
  error?: string;
}

export function useAIBrain() {
  const [isIngesting, setIsIngesting] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const ingestKnowledge = async (params: IngestParams): Promise<IngestResponse | null> => {
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

  const queryKnowledge = async (params: QueryParams): Promise<KnowledgeResult[] | null> => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Brain");
      toast.error("Authentication required to use AI Brain");
      return null;
    }

    setIsQuerying(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-brain-query', {
        body: {
          companyId: params.companyId,
          industry: params.industry,
          query: params.query,
          topK: params.topK || 5
        }
      });

      if (error) {
        console.error("Error querying AI Brain:", error);
        setError(error.message || "Error communicating with AI Brain");
        toast.error("Failed to query AI Brain");
        return null;
      }

      if (!data.results) {
        setError("No results returned from AI Brain");
        return [];
      }

      // Transform the results to match the expected format
      const results: KnowledgeResult[] = data.results.map((item: any) => ({
        content: item.content,
        sourceType: item.source_type,
        sourceId: item.source_id
      }));

      return results;
      
    } catch (err: any) {
      console.error("Exception when querying AI Brain:", err);
      setError(err.message || "Unknown error occurred");
      toast.error("Failed to query AI Brain");
      return null;
    } finally {
      setIsQuerying(false);
    }
  };
  
  const reindexKnowledge = async (): Promise<ReindexResponse | null> => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Brain");
      toast.error("Authentication required to use AI Brain");
      return null;
    }

    setIsReindexing(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-brain-reindex');

      if (error) {
        console.error("Error reindexing AI Brain:", error);
        setError(error.message || "Error reindexing AI Brain data");
        toast.error("Failed to reindex AI Brain data");
        return null;
      }

      if (data.success) {
        toast.success(`Successfully reindexed ${data.recordsProcessed} records`);
      } else {
        setError(data.error || "Unknown error during reindexing");
        toast.error("Reindexing failed");
      }
      
      return data;
      
    } catch (err: any) {
      console.error("Exception when reindexing AI Brain:", err);
      setError(err.message || "Unknown error occurred");
      toast.error("Failed to reindex data");
      return null;
    } finally {
      setIsReindexing(false);
    }
  };

  return {
    ingestKnowledge,
    queryKnowledge,
    reindexKnowledge,
    isIngesting,
    isQuerying,
    isReindexing,
    error
  };
}
