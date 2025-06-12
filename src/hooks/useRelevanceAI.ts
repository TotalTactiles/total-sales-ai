
import { useState, useCallback } from 'react';
import { relevanceAI, AgentWorkflow, WorkflowExecution, USAGE_TIERS } from '@/services/relevance/RelevanceAIService';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useRelevanceAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);

  const executeWorkflow = useCallback(async (workflowId: string, input: any) => {
    setIsLoading(true);
    try {
      const result = await relevanceAI.executeAgent(workflowId, input);
      
      const execution: WorkflowExecution = {
        id: crypto.randomUUID(),
        workflowId,
        status: result.success ? 'completed' : 'failed',
        startTime: new Date(),
        endTime: new Date(),
        result: result.output
      };
      
      setExecutions(prev => [execution, ...prev]);
      
      if (result.success) {
        toast.success('Workflow executed successfully');
      } else {
        toast.error('Workflow execution failed');
      }
      
      return result;
    } catch (error) {
      logger.error('Workflow execution error:', error);
      toast.error('Failed to execute workflow');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadWorkflows = useCallback(async () => {
    try {
      const workflowList = await relevanceAI.getWorkflows();
      setWorkflows(workflowList);
    } catch (error) {
      logger.error('Failed to load workflows:', error);
      toast.error('Failed to load workflows');
    }
  }, []);

  return {
    isLoading,
    workflows,
    executions,
    executeWorkflow,
    loadWorkflows,
    USAGE_TIERS
  };
};
