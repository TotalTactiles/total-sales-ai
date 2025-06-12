import { logger } from '@/utils/logger';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { masterAIBrain } from '@/services/masterAIBrain';
import { useManagerAI } from '@/hooks/useManagerAI';
import { useSalesRepAI } from '@/hooks/useSalesRepAI';
import { unifiedAIService } from '@/services/ai/unifiedAIService';
import { agentOrchestrator } from '@/services/agents/AgentOrchestrator';

interface UnifiedAIContextType {
  // Manager AI
  managerAI: ReturnType<typeof useManagerAI>;
  
  // Sales Rep AI
  salesRepAI: ReturnType<typeof useSalesRepAI>;
  
  // New Agent System
  executeAgentTask: (
    agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1',
    taskType: string,
    context?: any
  ) => Promise<any>;
  
  // Legacy unified AI functions (deprecated but maintained for compatibility)
  generateAIResponse: (prompt: string, context?: string) => Promise<string>;
  generateStrategyResponse: (prompt: string, context?: string) => Promise<string>;
  generateCommunication: (prompt: string, context?: string) => Promise<string>;
  
  // Shared AI functions
  logUserAction: (action: string, data: Record<string, any>) => Promise<void>;
  logAIInteraction: (type: string, data: Record<string, any>) => Promise<void>;
  getAIRecommendations: () => Promise<void>;
  
  // AI State
  isAIActive: boolean;
  aiErrors: string[];
  clearAIErrors: () => void;
  
  // Agent Performance
  getAgentPerformanceMetrics: () => Map<string, any>;
}

const UnifiedAIContext = createContext<UnifiedAIContextType | undefined>(undefined);

interface UnifiedAIProviderProps {
  children: ReactNode;
}

export const UnifiedAIProvider: React.FC<UnifiedAIProviderProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const [isAIActive, setIsAIActive] = useState(false);
  const [aiErrors, setAIErrors] = useState<string[]>([]);

  // Initialize AI hooks
  const managerAI = useManagerAI();
  const salesRepAI = useSalesRepAI();

  useEffect(() => {
    if (user?.id && profile?.company_id) {
      setIsAIActive(true);
      initializeAI();
    } else {
      setIsAIActive(false);
    }
  }, [user?.id, profile?.company_id]);

  const initializeAI = async () => {
    try {
      // Log AI system initialization
      await masterAIBrain.ingestEvent({
        user_id: user!.id,
        company_id: profile!.company_id,
        event_type: 'user_action',
        source: 'ai_system',
        data: {
          action: 'initialize_ai',
          role: profile!.role,
          timestamp: new Date().toISOString()
        }
      });

      // Get initial recommendations based on role
      if (profile?.role === 'manager') {
        await managerAI.getContextualInsights('/dashboard');
      } else if (profile?.role === 'sales_rep') {
        await salesRepAI.getPersonalizedRecommendations();
      }

    } catch (error) {
      logger.error('Error initializing AI:', error);
      addAIError('Failed to initialize AI system');
    }
  };

  // New agent-based execution
  const executeAgentTask = async (
    agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1',
    taskType: string,
    additionalContext?: any
  ): Promise<any> => {
    if (!user?.id || !profile?.company_id) {
      throw new Error('Authentication required');
    }

    try {
      const context = {
        workspace: window.location.pathname.split('/')[1] || 'dashboard',
        userRole: profile.role,
        companyId: profile.company_id,
        userId: user.id,
        ...additionalContext
      };

      const task = {
        agentType,
        taskType,
        context,
        priority: 'medium' as const
      };

      const result = await agentOrchestrator.executeTask(task);
      
      await logAIInteraction('agent_task_execution', {
        agentType,
        taskType,
        success: result.success,
        executionTime: result.executionTime
      });

      return result;

    } catch (error) {
      logger.error('Error executing agent task:', error);
      addAIError(`Failed to execute ${taskType}`);
      throw error;
    }
  };

  // Legacy functions maintained for compatibility
  const generateAIResponse = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await unifiedAIService.generateResponse(prompt, undefined, context);
      
      await logAIInteraction('unified_ai_response', {
        source: response.source,
        promptLength: prompt.length,
        responseLength: response.response.length
      });
      
      return response.response;
    } catch (error) {
      logger.error('Error generating AI response:', error);
      addAIError('Failed to generate AI response');
      throw error;
    }
  };

  const generateStrategyResponse = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await unifiedAIService.generateStrategyResponse(prompt);
      
      await logAIInteraction('strategy_response', {
        source: 'unified_ai',
        promptLength: prompt.length,
        responseLength: response.length
      });
      
      return response;
    } catch (error) {
      logger.error('Error generating strategy response:', error);
      addAIError('Failed to generate strategy response');
      throw error;
    }
  };

  const generateCommunication = async (prompt: string, context?: string): Promise<string> => {
    try {
      const response = await unifiedAIService.generateCommunication(prompt);
      
      await logAIInteraction('communication_draft', {
        source: 'unified_ai',
        promptLength: prompt.length,
        responseLength: response.length
      });
      
      return response;
    } catch (error) {
      logger.error('Error generating communication:', error);
      addAIError('Failed to generate communication');
      throw error;
    }
  };

  const logUserAction = async (action: string, data: Record<string, any>) => {
    if (!user?.id || !profile?.company_id) return;

    try {
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'user_action',
        source: 'unified_ai_context',
        data: {
          action,
          ...data,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error logging user action:', error);
      addAIError('Failed to log user action');
    }
  };

  const logAIInteraction = async (type: string, data: Record<string, any>) => {
    if (!user?.id || !profile?.company_id) return;

    try {
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'ai_output',
        source: type,
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error logging AI interaction:', error);
      addAIError('Failed to log AI interaction');
    }
  };

  const getAIRecommendations = async () => {
    if (!user?.id || !profile?.company_id) return;

    try {
      if (profile.role === 'manager') {
        await managerAI.getContextualInsights(window.location.pathname);
      } else if (profile.role === 'sales_rep') {
        await salesRepAI.getPersonalizedRecommendations();
      }
    } catch (error) {
      logger.error('Error getting AI recommendations:', error);
      addAIError('Failed to get AI recommendations');
    }
  };

  const addAIError = (error: string) => {
    setAIErrors(prev => [...prev, error]);
    
    // Auto-clear errors after 10 seconds
    setTimeout(() => {
      setAIErrors(prev => prev.filter(e => e !== error));
    }, 10000);
  };

  const clearAIErrors = () => {
    setAIErrors([]);
  };

  const getAgentPerformanceMetrics = () => {
    return agentOrchestrator.getPerformanceMetrics();
  };

  const value: UnifiedAIContextType = {
    managerAI,
    salesRepAI,
    executeAgentTask,
    generateAIResponse,
    generateStrategyResponse,
    generateCommunication,
    logUserAction,
    logAIInteraction,
    getAIRecommendations,
    isAIActive,
    aiErrors,
    clearAIErrors,
    getAgentPerformanceMetrics
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
