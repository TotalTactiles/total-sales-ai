
import { useState, useCallback } from 'react';
import { disabledAIService } from '@/services/ai/disabledAIService';
import { aiConfig } from '@/config/ai';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const generateResponse = useCallback(async (prompt: string, context?: any) => {
    if (!user) {
      toast.error('Please log in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await disabledAIService.generateResponse(prompt, context);
      
      // Always show disabled message since AI is turned off
      toast.info('AI features are currently disabled');
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI features are disabled';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateSalesResponse = useCallback(async (prompt: string, context?: any) => {
    if (!user) {
      toast.error('Please log in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await disabledAIService.generateSalesResponse(prompt, context);
      
      // Always show disabled message since AI is turned off
      toast.info('AI features are currently disabled');
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI features are disabled';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateResponse,
    generateSalesResponse,
    isLoading,
    error,
    clearError,
    isEnabled: aiConfig.enabled // Always false when disabled
  };
};
