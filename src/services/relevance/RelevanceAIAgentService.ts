
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AgentHealthStatus {
  agent_name: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  last_health_check: Date;
  response_time_ms?: number;
  error_count: number;
  success_count: number;
  metadata: Record<string, any>;
}

export interface AgentTask {
  id: string;
  company_id: string;
  user_id: string;
  agent_type: string;
  task_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'retrying';
  input_payload: any;
  output_payload?: any;
  error_message?: string;
  retry_count: number;
  execution_time_ms?: number;
  started_at: Date;
  completed_at?: Date;
}

export interface RelevanceAPIResponse {
  success: boolean;
  result?: any;
  error?: string;
  execution_time_ms: number;
}

class RelevanceAIAgentService {
  private baseUrl = 'https://yztozysvxyjqguybokqj.supabase.co/functions/v1/relevance-ai';
  private maxRetries = 3;
  private retryDelay = 1000;

  // API Health Check
  async performHealthCheck(agentName: string): Promise<AgentHealthStatus> {
    const startTime = Date.now();
    
    try {
      const response = await this.makeRequest('list_workflows', {});
      const responseTime = Date.now() - startTime;

      const healthStatus: AgentHealthStatus = {
        agent_name: agentName,
        status: 'online',
        last_health_check: new Date(),
        response_time_ms: responseTime,
        error_count: 0,
        success_count: 1,
        metadata: { last_ping: new Date().toISOString() }
      };

      await this.updateAgentStatus(healthStatus);
      return healthStatus;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(`Health check failed for agent ${agentName}:`, error);

      const healthStatus: AgentHealthStatus = {
        agent_name: agentName,
        status: 'error',
        last_health_check: new Date(),
        response_time_ms: responseTime,
        error_count: 1,
        success_count: 0,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      };

      await this.updateAgentStatus(healthStatus);
      return healthStatus;
    }
  }

  // Execute Agent Task with Retry Logic
  async executeAgentTask(
    agentType: string,
    taskType: string,
    input: any,
    userId: string,
    companyId: string
  ): Promise<AgentTask> {
    const taskId = crypto.randomUUID();
    const task: Partial<AgentTask> = {
      id: taskId,
      company_id: companyId,
      user_id: userId,
      agent_type: agentType,
      task_type: taskType,
      status: 'pending',
      input_payload: input,
      retry_count: 0,
      started_at: new Date()
    };

    // Log task creation
    await this.logAgentTask(task as AgentTask);

    return await this.executeTaskWithRetry(task as AgentTask);
  }

  private async executeTaskWithRetry(task: AgentTask): Promise<AgentTask> {
    const startTime = Date.now();

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        task.status = 'in_progress';
        task.retry_count = attempt;
        await this.updateAgentTask(task);

        const response = await this.makeRequest('execute_workflow', {
          workflowId: this.getWorkflowForTask(task.task_type),
          input: task.input_payload,
          userId: task.user_id
        });

        task.status = 'completed';
        task.output_payload = response.result;
        task.execution_time_ms = Date.now() - startTime;
        task.completed_at = new Date();

        await this.updateAgentTask(task);
        await this.incrementSuccessCount(task.agent_type);

        logger.info(`Agent task completed successfully`, { taskId: task.id, attempt });
        return task;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.warn(`Agent task attempt ${attempt + 1} failed:`, { taskId: task.id, error: errorMessage });

        if (attempt === this.maxRetries) {
          task.status = 'failed';
          task.error_message = errorMessage;
          task.execution_time_ms = Date.now() - startTime;
          task.completed_at = new Date();

          await this.updateAgentTask(task);
          await this.incrementErrorCount(task.agent_type);
          await this.handleTaskFailure(task, errorMessage);
          
          return task;
        } else {
          task.status = 'retrying';
          await this.updateAgentTask(task);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
        }
      }
    }

    return task;
  }

  // Core API Communication
  private async makeRequest(action: string, data: any): Promise<RelevanceAPIResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getSupabaseToken()}`
        },
        body: JSON.stringify({ action, data })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const execution_time_ms = Date.now() - startTime;

      return {
        success: true,
        result: result.result || result,
        execution_time_ms
      };

    } catch (error) {
      const execution_time_ms = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        success: false,
        error: errorMessage,
        execution_time_ms
      };
    }
  }

  // Database Operations
  private async logAgentTask(task: AgentTask): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_tasks')
        .insert({
          id: task.id,
          company_id: task.company_id,
          user_id: task.user_id,
          agent_type: task.agent_type,
          task_type: task.task_type,
          status: task.status,
          input_payload: task.input_payload,
          retry_count: task.retry_count,
          started_at: task.started_at.toISOString()
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Failed to log agent task:', error);
    }
  }

  private async updateAgentTask(task: AgentTask): Promise<void> {
    try {
      const updateData: any = {
        status: task.status,
        retry_count: task.retry_count,
        error_message: task.error_message,
        execution_time_ms: task.execution_time_ms
      };

      if (task.output_payload) {
        updateData.output_payload = task.output_payload;
      }

      if (task.completed_at) {
        updateData.completed_at = task.completed_at.toISOString();
      }

      const { error } = await supabase
        .from('ai_agent_tasks')
        .update(updateData)
        .eq('id', task.id);

      if (error) throw error;
    } catch (error) {
      logger.error('Failed to update agent task:', error);
    }
  }

  private async updateAgentStatus(status: AgentHealthStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_status')
        .upsert({
          agent_name: status.agent_name,
          status: status.status,
          last_health_check: status.last_health_check.toISOString(),
          response_time_ms: status.response_time_ms,
          error_count: status.error_count,
          success_count: status.success_count,
          metadata: status.metadata,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Failed to update agent status:', error);
    }
  }

  // Agent Management
  async getAllAgentStatuses(): Promise<AgentHealthStatus[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agent_status')
        .select('*')
        .order('agent_name');

      if (error) throw error;

      return (data || []).map(row => ({
        agent_name: row.agent_name,
        status: row.status,
        last_health_check: new Date(row.last_health_check),
        response_time_ms: row.response_time_ms,
        error_count: row.error_count,
        success_count: row.success_count,
        metadata: row.metadata || {}
      }));
    } catch (error) {
      logger.error('Failed to get agent statuses:', error);
      return [];
    }
  }

  async getAgentTasks(companyId: string, limit = 50): Promise<AgentTask[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agent_tasks')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        company_id: row.company_id,
        user_id: row.user_id,
        agent_type: row.agent_type,
        task_type: row.task_type,
        status: row.status,
        input_payload: row.input_payload,
        output_payload: row.output_payload,
        error_message: row.error_message,
        retry_count: row.retry_count,
        execution_time_ms: row.execution_time_ms,
        started_at: new Date(row.started_at),
        completed_at: row.completed_at ? new Date(row.completed_at) : undefined
      }));
    } catch (error) {
      logger.error('Failed to get agent tasks:', error);
      return [];
    }
  }

  // Utility Methods
  private getWorkflowForTask(taskType: string): string {
    const workflowMap: Record<string, string> = {
      'lead_analysis': 'lead_intelligence_workflow',
      'follow_up_generation': 'follow_up_sequence_workflow',
      'objection_handling': 'objection_response_workflow',
      'email_draft': 'email_generation_workflow',
      'call_summary': 'call_analysis_workflow',
      'lead_scoring': 'lead_scoring_workflow'
    };

    return workflowMap[taskType] || 'default_workflow';
  }

  private async getSupabaseToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  }

  private async incrementSuccessCount(agentType: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_agent_success', {
        agent_name: agentType
      });
      if (error) logger.warn('Failed to increment success count:', error);
    } catch (error) {
      logger.warn('Failed to increment success count:', error);
    }
  }

  private async incrementErrorCount(agentType: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_agent_error', {
        agent_name: agentType
      });
      if (error) logger.warn('Failed to increment error count:', error);
    } catch (error) {
      logger.warn('Failed to increment error count:', error);
    }
  }

  private async handleTaskFailure(task: AgentTask, errorMessage: string): Promise<void> {
    // Check for critical failure patterns
    if (task.retry_count >= this.maxRetries) {
      logger.error('Agent task failed after maximum retries', {
        taskId: task.id,
        agentType: task.agent_type,
        taskType: task.task_type,
        error: errorMessage
      });

      // Show user notification
      toast.error(`AI Agent task failed: ${task.task_type}`, {
        description: 'The system will retry automatically. Check the Developer Console for details.'
      });

      // Check for widespread failures
      await this.checkForSystemFailures(task.company_id);
    }
  }

  private async checkForSystemFailures(companyId: string): Promise<void> {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('ai_agent_tasks')
        .select('id')
        .eq('company_id', companyId)
        .eq('status', 'failed')
        .gte('created_at', thirtyMinutesAgo.toISOString());

      if (error) throw error;

      if (data && data.length >= 3) {
        logger.error('Multiple agent failures detected', {
          companyId,
          failureCount: data.length,
          timeWindow: '30 minutes'
        });

        toast.error('AI Agent System Alert', {
          description: 'Multiple agent failures detected. System administrators have been notified.',
          duration: 10000
        });
      }
    } catch (error) {
      logger.error('Failed to check for system failures:', error);
    }
  }

  // Public API for testing agent connectivity
  async pingTest(): Promise<{ success: boolean; responseTime: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      const response = await this.makeRequest('list_workflows', {});
      return {
        success: response.success,
        responseTime: response.execution_time_ms,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const relevanceAIAgent = new RelevanceAIAgentService();
