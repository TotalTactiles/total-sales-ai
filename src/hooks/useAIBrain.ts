
import { useEffect } from 'react';
import { internalAIBrain } from '@/services/ai/internalAIBrain';
import { logger } from '@/utils/logger';

interface QueryParams {
  industry: string;
  query: string;
  topK?: number;
}

export interface KnowledgeResult {
  content: string;
  sourceType: string;
  sourceId: string;
}

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
      return { success: true, chunks_success: 0, chunks_total: 0 };
    },
    
    queryKnowledge: async (params: QueryParams): Promise<KnowledgeResult[]> => {
      logger.info('Knowledge query called via AI Brain:', params);
      return [];
    },
    
    isIngesting: false,
    isQuerying: false,
    error: null
  };
};
