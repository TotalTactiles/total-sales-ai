import { useState } from 'react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { voiceAIService } from '@/services/ai/voiceAIService';
import { retellAIService } from '@/services/ai/retellAIService';

interface RetellCallResult {
  success: boolean;
  callId?: string;
  error?: string;
}

export const useRetellAI = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeConversationalCall = async (
    lead: Lead
  ): Promise<RetellCallResult> => {
    if (!user?.id) {
      toast.error('Authentication required');
      return { success: false, error: 'Not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await voiceAIService.initiateAICall(
        lead.phone,
        lead.id,
        lead.name,
        user.id,
        lead
      );

      if (!result.success) {
        setError('Failed to initiate AI call');
      }

      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to initiate AI call';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const getCallAnalysis = async (callId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await retellAIService.getCallAnalysis(callId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to get call analysis';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    makeConversationalCall,
    getCallAnalysis,
    isLoading,
    error
  };
};
