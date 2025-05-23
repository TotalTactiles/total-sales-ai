
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from '@supabase/supabase-js';

interface QueryParams {
  companyId?: string;
  industry: string;
  query: string;
  topK?: number;
}

export interface KnowledgeResult {
  content: string;
  sourceType: string;
  sourceId: string;
}

export function useKnowledgeQuery() {
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryKnowledge = async (
    user: User | null,
    params: QueryParams
  ): Promise<KnowledgeResult[] | null> => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Brain");
      toast.error("Authentication required to use AI Brain");
      return null;
    }

    // Get the user's company_id from their profile if not provided
    let companyId = params.companyId;
    
    if (!companyId) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching user's company_id:", profileError);
        } else if (profileData) {
          companyId = profileData.company_id;
        }
      } catch (err) {
        console.error("Exception when fetching user's company_id:", err);
      }
    }

    setIsQuerying(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-brain-query', {
        body: {
          companyId,
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

  return {
    queryKnowledge,
    isQuerying,
    error
  };
}
