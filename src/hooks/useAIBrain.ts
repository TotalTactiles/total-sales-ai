
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

  // New function for crawling web content
  const crawlWebContent = async (url: string, industry: string, sourceType: string): Promise<IngestResponse | null> => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Brain");
      toast.error("Authentication required to use AI Brain");
      return null;
    }

    setIsIngesting(true);
    setError(null);
    
    try {
      // Here we would call a different edge function specifically for crawling
      const { data, error } = await supabase.functions.invoke('ai-brain-crawl', {
        body: {
          url,
          industry,
          sourceType,
          companyId: user.company_id
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

  // Function to delete knowledge entry
  const deleteKnowledgeEntry = async (id: string): Promise<boolean> => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Brain");
      toast.error("Authentication required to use AI Brain");
      return false;
    }

    try {
      const { error } = await supabase
        .from('industry_knowledge')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting knowledge entry:", error);
        toast.error("Failed to delete knowledge entry");
        return false;
      }

      toast.success("Knowledge entry deleted successfully");
      return true;
      
    } catch (err: any) {
      console.error("Exception when deleting knowledge entry:", err);
      toast.error("Failed to delete knowledge entry");
      return false;
    }
  };

  // Function to mark an entry as a case study
  const markAsCaseStudy = async (id: string, metadata?: Record<string, any>): Promise<boolean> => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Brain");
      toast.error("Authentication required to use AI Brain");
      return false;
    }

    try {
      const updateData: { source_type: string; metadata?: Record<string, any> } = {
        source_type: 'case-study'
      };
      
      if (metadata) {
        updateData.metadata = metadata;
      }
      
      const { error } = await supabase
        .from('industry_knowledge')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error("Error marking as case study:", error);
        toast.error("Failed to mark as case study");
        return false;
      }

      toast.success("Entry marked as case study");
      return true;
      
    } catch (err: any) {
      console.error("Exception when marking as case study:", err);
      toast.error("Failed to mark as case study");
      return false;
    }
  };

  return {
    ingestKnowledge,
    queryKnowledge,
    reindexKnowledge,
    crawlWebContent,
    deleteKnowledgeEntry,
    markAsCaseStudy,
    isIngesting,
    isQuerying,
    isReindexing,
    error
  };
}
