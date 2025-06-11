
import { useState, useCallback } from 'react';
import { agentOrchestrator, AgentTask, AgentContext } from '@/services/agents/AgentOrchestrator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAgentIntegration = () => {
  const { user, profile } = useAuth();
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const executeAgentTask = useCallback(async (
    agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1',
    taskType: string,
    additionalContext: Partial<AgentContext> = {}
  ) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return null;
    }

    setIsExecuting(true);
    
    try {
      const baseContext: AgentContext = {
        workspace: window.location.pathname.split('/')[1] || 'dashboard',
        userRole: profile.role,
        companyId: profile.company_id,
        userId: user.id,
        tone: 'professional', // Default tone, could be from user settings
        ...additionalContext
      };

      const task: AgentTask = {
        agentType,
        taskType,
        context: baseContext,
        priority: 'medium'
      };

      const result = await agentOrchestrator.executeTask(task);
      setLastResult(result);
      
      if (result.status === 'completed') {
        toast.success(`${taskType.replace('_', ' ')} completed successfully`);
      } else {
        toast.error(`Failed to complete ${taskType.replace('_', ' ')}`);
      }

      return result;

    } catch (error) {
      console.error('Agent execution error:', error);
      toast.error('AI agent encountered an error');
      return null;
    } finally {
      setIsExecuting(false);
    }
  }, [user?.id, profile?.company_id, profile?.role]);

  const submitFeedback = useCallback(async (
    taskId: string,
    rating: 'positive' | 'negative',
    correction?: string
  ) => {
    if (!user?.id) return;

    try {
      await agentOrchestrator.submitFeedback(user.id, taskId, rating, correction);
      toast.success('Feedback submitted - AI will learn from this');
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Failed to submit feedback');
    }
  }, [user?.id]);

  return {
    executeAgentTask,
    submitFeedback,
    isExecuting,
    lastResult
  };
};
