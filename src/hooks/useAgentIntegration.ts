
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { relevanceAgentService } from '@/services/relevance/RelevanceAgentService';
import { agentOrchestrator, AgentContext } from '@/services/agents/AgentOrchestrator';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useAgentIntegration = () => {
  const { user, profile } = useAuth();
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const executeAgentTask = async (
    agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1',
    taskType: string,
    additionalContext?: Partial<AgentContext>
  ) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required for AI agents');
      return null;
    }

    setIsExecuting(true);

    try {
      const context: AgentContext = {
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
      setLastResult(result);

      if (result.status === 'completed') {
        toast.success(`AI Agent completed: ${taskType}`);
      } else if (result.status === 'failed') {
        toast.error(`AI Agent failed: ${result.error_message}`);
      }

      return result;

    } catch (error) {
      logger.error('Agent integration error:', error);
      toast.error('AI Agent execution failed');
      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  const executeSalesAgent = async (taskType: string, context?: Partial<AgentContext>) => {
    return executeAgentTask('salesAgent_v1', taskType, context);
  };

  const executeManagerAgent = async (taskType: string, context?: Partial<AgentContext>) => {
    return executeAgentTask('managerAgent_v1', taskType, context);
  };

  const executeAutomationAgent = async (taskType: string, context?: Partial<AgentContext>) => {
    return executeAgentTask('automationAgent_v1', taskType, context);
  };

  const executeDeveloperAgent = async (taskType: string, context?: Partial<AgentContext>) => {
    return executeAgentTask('developerAgent_v1', taskType, context);
  };

  return {
    executeAgentTask,
    executeSalesAgent,
    executeManagerAgent,
    executeAutomationAgent,
    executeDeveloperAgent,
    isExecuting,
    lastResult
  };
};
