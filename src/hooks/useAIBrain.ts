
import { useEffect } from 'react';
import { internalAIBrain } from '@/services/ai/internalAIBrain';
import { logger } from '@/utils/logger';

export const useAIBrain = () => {
  useEffect(() => {
    // Initialize AI Brain on app start
    logger.info('Initializing AI Brain from React hook');
    
    return () => {
      // Cleanup on unmount
      internalAIBrain.destroy();
    };
  }, []);

  return {
    reportError: (errorData: {
      component: string;
      route?: string;
      error_type: string;
      stack_trace?: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }) => internalAIBrain.handleError(errorData),
    
    // Add compatibility methods for existing components
    ingestKnowledge: async (data: any) => {
      logger.info('Knowledge ingestion called via AI Brain');
      return Promise.resolve();
    },
    
    queryKnowledge: async (query: string) => {
      logger.info('Knowledge query called via AI Brain:', query);
      return Promise.resolve('AI Brain knowledge query response');
    },
    
    isIngesting: false,
    isQuerying: false,
    error: null
  };
};
