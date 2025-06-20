
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
    }) => internalAIBrain.handleError(errorData)
  };
};
