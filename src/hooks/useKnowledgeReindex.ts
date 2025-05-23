
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from '@supabase/supabase-js';

interface ReindexResponse {
  success: boolean;
  recordsProcessed: number;
  error?: string;
}

export function useKnowledgeReindex() {
  const [isReindexing, setIsReindexing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reindexKnowledge = async (user: User | null): Promise<ReindexResponse | null> => {
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
    reindexKnowledge,
    isReindexing,
    error
  };
}
