
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { logger } from '@/utils/logger';

// AI_INTEGRATION_DISABLED - Unified AI context disabled but structure maintained
interface UnifiedAIContextType {
  isEnabled: boolean;
  processRequest: (request: any) => Promise<any>;
  getContextualResponse: (context: string, data?: any) => Promise<string>;
  isProcessing: boolean;
}

const UnifiedAIContext = createContext<UnifiedAIContextType | undefined>(undefined);

interface UnifiedAIProviderProps {
  children: ReactNode;
}

export const UnifiedAIProvider: React.FC<UnifiedAIProviderProps> = ({ children }) => {
  const [isProcessing] = useState(false);

  const processRequest = async (request: any): Promise<any> => {
    logger.info('Unified AI request disabled - all AI integrations turned off', request, 'unified_ai');
    return {
      response: 'AI features are currently disabled',
      status: 'disabled'
    };
  };

  const getContextualResponse = async (context: string, data?: any): Promise<string> => {
    logger.info('Contextual AI response disabled', { context, data }, 'unified_ai');
    return 'AI features are currently disabled';
  };

  const value: UnifiedAIContextType = {
    isEnabled: false, // AI_INTEGRATION_DISABLED
    processRequest,
    getContextualResponse,
    isProcessing
  };

  return (
    <UnifiedAIContext.Provider value={value}>
      {children}
    </UnifiedAIContext.Provider>
  );
};

export const useUnifiedAI = () => {
  const context = useContext(UnifiedAIContext);
  if (context === undefined) {
    throw new Error('useUnifiedAI must be used within a UnifiedAIProvider');
  }
  return context;
};
