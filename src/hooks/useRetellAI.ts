
import { useState } from 'react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { retellAIService } from '@/services/ai/retellAIService';
=======
import { useAuth } from '@/contexts/AuthContext';
import { voiceAIService } from '@/services/ai/voiceAIService';

interface RetellCallResult {
  success: boolean;
  callId?: string;
  error?: string;
}

export const useRetellAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeConversationalCall = async (
    lead: Lead
  ): Promise<RetellCallResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await retellAIService.initiateCall({
        phoneNumber: lead.phone,
        leadName: lead.name,
        leadContext: lead
      });

      if (!result.success) {
        setError(result.error || 'Failed to initiate AI call');
        return { success: false, error: result.error };
      }

      toast.success(`AI conversation initiated with ${lead.name}`);
      return { success: true, callId: result.callId };
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
=======
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
    getCallAnalysis,
    isLoading,
    error
  };
};
