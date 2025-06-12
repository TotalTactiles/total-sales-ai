
import { useState, useCallback } from 'react';
import { agentOrchestrator, AgentTask } from '@/services/agents/AgentOrchestrator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface UseAgentIntegrationResult {
  executeTask: (taskType: string, agentType: AgentTask['agentType'], additionalContext?: any) => Promise<any>;
  executeAgentTask: (agentType: AgentTask['agentType'], taskType: string, additionalContext?: any) => Promise<any>;
  isLoading: boolean;
  isExecuting: boolean;
  error: string | null;
  submitFeedback: (taskId: string, rating: 'positive' | 'negative', correction?: string) => Promise<void>;
}

export const useAgentIntegration = (workspace: string = 'dashboard'): UseAgentIntegrationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const executeTask = useCallback(async (
    taskType: string, 
    agentType: AgentTask['agentType'], 
    additionalContext: any = {}
  ) => {
    if (!user?.id || !profile?.company_id) {
      throw new Error('Authentication required');
    }

    setIsLoading(true);
    setError(null);

    try {
      const task: AgentTask = {
        agentType,
        taskType,
        context: {
          workspace,
          userRole: profile.role || 'sales_rep',
          companyId: profile.company_id,
          userId: user.id,
          ...additionalContext
        }
      };

      const result = await agentOrchestrator.executeTask(task);
      
      if (!result.success) {
        throw new Error(result.output?.error || 'Task execution failed');
      }

      logger.info('Agent task completed successfully', { 
        taskType, 
        agentType, 
        executionTime: result.executionTime 
      });

      return result.output;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error('Agent task failed:', err);
      toast.error(`AI task failed: ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workspace, user?.id, profile?.company_id, profile?.role]);

  // Alias method with different parameter order for compatibility
  const executeAgentTask = useCallback(async (
    agentType: AgentTask['agentType'],
    taskType: string,
    additionalContext: any = {}
  ) => {
    return executeTask(taskType, agentType, additionalContext);
  }, [executeTask]);

  const submitFeedback = useCallback(async (
    taskId: string, 
    rating: 'positive' | 'negative', 
    correction?: string
  ) => {
    if (!user?.id) return;

    try {
      await agentOrchestrator.submitFeedback(user.id, taskId, rating, correction);
      toast.success('Feedback submitted successfully');
    } catch (err) {
      logger.error('Failed to submit feedback:', err);
      toast.error('Failed to submit feedback');
    }
  }, [user?.id]);

  return {
    executeTask,
    executeAgentTask,
    isLoading,
    isExecuting: isLoading,
    error,
    submitFeedback
  };
};
