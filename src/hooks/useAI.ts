
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
      
      if (!aiConfig.enabled) {
        toast.info('AI Demo Mode - Generated mock response');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate AI response';
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
      
      if (!aiConfig.enabled) {
        toast.info('AI Demo Mode - Generated mock sales response');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate sales response';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateEmailDraft = useCallback(async (recipientData: any, context?: any) => {
    if (!user) {
      toast.error('Please log in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const draft = await disabledAIService.generateEmailDraft(recipientData, context);
      
      if (!aiConfig.enabled) {
        toast.success('AI Demo Mode - Generated mock email draft');
      }
      
      return draft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate email draft';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateCallScript = useCallback(async (leadData: any, callType: string = 'cold') => {
    if (!user) {
      toast.error('Please log in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const script = await disabledAIService.generateCallScript(leadData, callType);
      
      if (!aiConfig.enabled) {
        toast.success('AI Demo Mode - Generated mock call script');
      }
      
      return script;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate call script';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const analyzeLeadScore = useCallback(async (leadData: any) => {
    if (!user) {
      toast.error('Please log in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const score = await disabledAIService.analyzeLeadScore(leadData);
      
      if (!aiConfig.enabled) {
        toast.info('AI Demo Mode - Generated mock lead score');
      }
      
      return score;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze lead score';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const executeAutomation = useCallback(async (workflowId: string, data: any) => {
    if (!user) {
      toast.error('Please log in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await disabledAIService.executeAutomation(workflowId, data);
      
      if (!aiConfig.enabled) {
        toast.success('AI Demo Mode - Executed mock automation');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute automation';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    generateResponse,
    generateSalesResponse,
    generateEmailDraft,
    generateCallScript,
    analyzeLeadScore,
    executeAutomation,
    isLoading,
    error,
    isAIEnabled: aiConfig.enabled,
    aiConfig: disabledAIService.getConfig(),
    metrics: disabledAIService.getMetrics()
  };
};
