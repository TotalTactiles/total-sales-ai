
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { logger } from '@/utils/logger';

// AI_INTEGRATION_DISABLED - Unified AI context disabled but structure maintained
interface UnifiedAIContextType {
  isEnabled: boolean;
  processRequest: (request: any) => Promise<any>;
  getContextualResponse: (context: string, data?: any) => Promise<string>;
  generateAIResponse: (prompt: string) => Promise<string>;
  generateStrategyResponse: (prompt: string) => Promise<string>;
  generateCommunication: (prompt: string) => Promise<string>;
  logAIInteraction: (type: string, data: any) => Promise<void>;
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

  const generateAIResponse = async (prompt: string): Promise<string> => {
    logger.info('AI response generation disabled', { prompt }, 'unified_ai');
    return 'AI features are currently disabled. All AI integrations have been turned off.';
  };

  const generateStrategyResponse = async (prompt: string): Promise<string> => {
    logger.info('Strategy AI response disabled', { prompt }, 'unified_ai');
    return 'AI strategy features are currently disabled. All AI integrations have been turned off.';
  };

  const generateCommunication = async (prompt: string): Promise<string> => {
    logger.info('Communication AI response disabled', { prompt }, 'unified_ai');
    return 'AI communication features are currently disabled. All AI integrations have been turned off.';
  };

  const logAIInteraction = async (type: string, data: any): Promise<void> => {
    logger.info('AI interaction logging disabled', { type, data }, 'unified_ai');
  };

  const value: UnifiedAIContextType = {
    isEnabled: false, // AI_INTEGRATION_DISABLED
    processRequest,
    getContextualResponse,
    generateAIResponse,
    generateStrategyResponse,
    generateCommunication,
    logAIInteraction,
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
