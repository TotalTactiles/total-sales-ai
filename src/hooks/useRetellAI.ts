
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';

export interface RetellCallResult {
  success: boolean;
  callId?: string;
  agentId?: string;
  error?: string;
}

export const useRetellAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const makeConversationalCall = async (lead: Lead): Promise<RetellCallResult> => {
    if (!user?.id) {
      toast.error('Authentication required');
      return { success: false, error: 'Not authenticated' };
    }

    setIsLoading(true);
    
    try {
      // Prepare lead context for AI
      const leadContext = {
        name: lead.name,
        company: lead.company,
        source: lead.source,
        score: lead.score,
        priority: lead.priority,
        tags: lead.tags,
        lastContact: lead.lastContact,
        conversionLikelihood: lead.conversionLikelihood,
        speedToLead: lead.speedToLead,
        // Add any pain points or notes if available
        notes: `Lead score: ${lead.score}%, Priority: ${lead.priority}, Source: ${lead.source}`,
        callObjective: lead.priority === 'high' ? 'Schedule demo ASAP' : 'Qualify and assess interest'
      };

      const { data, error } = await supabase.functions.invoke('retell-ai', {
        body: {
          phoneNumber: lead.phone,
          leadId: lead.id,
          leadName: lead.name,
          leadContext,
          userId: user.id
        }
      });

      if (error) {
        console.error('Retell AI call error:', error);
        toast.error('Failed to initiate AI call');
        return { success: false, error: error.message };
      }

      if (data.success) {
        toast.success(`AI assistant is calling ${lead.name}...`);
        return {
          success: true,
          callId: data.callId,
          agentId: data.agentId
        };
      }

      throw new Error(data.error || 'Unknown error');
      
    } catch (error) {
      console.error('Retell AI call failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`AI call failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const getCallAnalysis = async (callId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('retell-ai', {
        body: {
          action: 'get_analysis',
          callId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get call analysis:', error);
      return null;
    }
  };

  return {
    makeConversationalCall,
    getCallAnalysis,
    isLoading
  };
};
