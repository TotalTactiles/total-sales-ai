import { logger } from '@/utils/logger';
import { relevanceAgentService } from '@/services/relevance/RelevanceAgentService';
import { supabase } from '@/integrations/supabase/client';

export interface AgentContext {
  workspace: string;
  userRole: string;
  companyId: string;
  userId: string;
  currentLead?: any;
  callContext?: any;
  emailContext?: any;
  smsContext?: any;
  isCallActive?: boolean;
  query?: string;
}

export interface AgentTask {
  agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1';
  taskType: string;
  context: AgentContext;
  priority: 'low' | 'medium' | 'high';
}

export interface AgentTaskResult {
  taskId: string;
  id?: string;
  agentType: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: any;
  output_payload?: any;
  error_message?: string;
  execution_time_ms?: number;
  created_at: string;
  completed_at?: string;
}

export interface AgentPerformanceMetrics {
  totalTasks: number;
  successfulTasks: number;
  failedTasks: number;
  avgExecutionTime: number;
  totalExecutionTime: number;
}

class AgentOrchestrator {
  private taskQueue: AgentTask[] = [];
  private runningTasks: Map<string, AgentTaskResult> = new Map();
  private performanceMetrics: Map<string, AgentPerformanceMetrics> = new Map();

  async executeTask(task: AgentTask): Promise<AgentTaskResult> {
    const taskId = crypto.randomUUID();
    const startTime = Date.now();

    const result: AgentTaskResult = {
      taskId,
      id: taskId,
      agentType: task.agentType,
      status: 'running',
      created_at: new Date().toISOString()
    };

    this.runningTasks.set(taskId, result);

    try {
      logger.info('Executing agent task', { taskId, agentType: task.agentType, taskType: task.taskType });

      // Route to appropriate agent service
      let agentResult;
      switch (task.agentType) {
        case 'salesAgent_v1':
          agentResult = await relevanceAgentService.executeSalesAgent(
            task.taskType,
            this.buildAgentPayload(task),
            task.context.userId,
            task.context.companyId
          );
          break;
        case 'managerAgent_v1':
          agentResult = await relevanceAgentService.executeManagerAgent(
            task.taskType,
            this.buildAgentPayload(task),
            task.context.userId,
            task.context.companyId
          );
          break;
        case 'automationAgent_v1':
          agentResult = await relevanceAgentService.executeAutomationAgent(
            task.taskType,
            this.buildAgentPayload(task),
            task.context.userId,
            task.context.companyId
          );
          break;
        case 'developerAgent_v1':
          agentResult = await relevanceAgentService.executeDeveloperAgent(
            task.taskType,
            this.buildAgentPayload(task),
            task.context.userId,
            task.context.companyId
          );
          break;
        default:
          throw new Error(`Unknown agent type: ${task.agentType}`);
      }

      const executionTime = Date.now() - startTime;

      // Update result
      result.status = agentResult.success ? 'completed' : 'failed';
      result.output = agentResult.output;
      result.output_payload = { response: agentResult.output };
      result.error_message = agentResult.error;
      result.execution_time_ms = executionTime;
      result.completed_at = new Date().toISOString();

      // Update performance metrics
      this.updatePerformanceMetrics(task.agentType, result);

      logger.info('Agent task completed', { taskId, status: result.status, executionTime });

      return result;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      result.status = 'failed';
      result.error_message = error instanceof Error ? error.message : 'Unknown error';
      result.execution_time_ms = executionTime;
      result.completed_at = new Date().toISOString();

      logger.error('Agent task failed', error, 'agent_orchestrator');

      return result;
    } finally {
      this.runningTasks.delete(taskId);
    }
  }

  async submitFeedback(
    userId: string,
    taskId: string,
    rating: 'positive' | 'negative',
    feedback?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_tasks')
        .update({
          feedback_rating: rating,
          feedback_text: feedback,
          feedback_submitted_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;

      logger.info('Agent feedback submitted', { taskId, rating, userId });
    } catch (error) {
      logger.error('Failed to submit agent feedback', error);
      throw error;
    }
  }

  private buildAgentPayload(task: AgentTask): any {
    return {
      taskType: task.taskType,
      context: task.context,
      priority: task.priority,
      timestamp: new Date().toISOString(),
      workspace: task.context.workspace,
      userRole: task.context.userRole
    };
  }

  private updatePerformanceMetrics(agentType: string, result: AgentTaskResult): void {
    const current = this.performanceMetrics.get(agentType) || {
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      avgExecutionTime: 0,
      totalExecutionTime: 0
    };

    current.totalTasks++;
    
    if (result.status === 'completed') {
      current.successfulTasks++;
    } else {
      current.failedTasks++;
    }

    if (result.execution_time_ms) {
      current.totalExecutionTime += result.execution_time_ms;
      current.avgExecutionTime = current.totalExecutionTime / current.totalTasks;
    }

    this.performanceMetrics.set(agentType, current);
  }

  getPerformanceMetrics(): Map<string, AgentPerformanceMetrics> {
    return new Map(this.performanceMetrics);
  }

  getRunningTasks(): AgentTaskResult[] {
    return Array.from(this.runningTasks.values());
  }

  async getTaskHistory(agentType?: string): Promise<AgentTaskResult[]> {
    try {
      let query = supabase
        .from('ai_agent_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (agentType) {
        query = query.eq('agent_type', agentType);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(task => ({
        taskId: task.id,
        id: task.id,
        agentType: task.agent_type,
        status: task.status,
        output: task.output_payload,
        output_payload: task.output_payload,
        error_message: task.error_message,
        execution_time_ms: task.execution_time_ms,
        created_at: task.created_at,
        completed_at: task.completed_at
      }));

    } catch (error) {
      logger.error('Failed to get task history', error);
      return [];
    }
  }
}

export const agentOrchestrator = new AgentOrchestrator();
