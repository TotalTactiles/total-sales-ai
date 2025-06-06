
import { useState } from 'react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { voiceAIService } from '@/services/ai/voiceAIService';

interface RetellCallResult {
  success: boolean;
  callId?: string;
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
      const result = await voiceAIService.initiateAICall(
        lead.phone,
        lead.id,
        lead.name,
        user.id,
        lead
      );

      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initiate AI call'
      };
    }
  };

  return {
    makeConversationalCall,
    isLoading
  };
};
