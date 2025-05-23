
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from '@supabase/supabase-js';

export function useKnowledgeManagement() {
  const [error, setError] = useState<string | null>(null);

  const deleteKnowledgeEntry = async (
    user: User | null,
    id: string
  ): Promise<boolean> => {
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

  const markAsCaseStudy = async (
    user: User | null,
    id: string, 
    metadata?: Record<string, any>
  ): Promise<boolean> => {
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
    deleteKnowledgeEntry,
    markAsCaseStudy,
    error
  };
}
