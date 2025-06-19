
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { relevanceAIConnection } from '@/services/relevance/RelevanceAIConnectionService';

export interface AgentContext {
  workspace: string;
  userRole: string;
  companyId: string;
  userId: string;
  currentLead?: any;
  isCallActive?: boolean;
  callDuration?: number;
  metadata?: Record<string, any>;
}

export interface AgentTask {
  agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1';
  taskType: string;
  context: AgentContext;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AgentExecutionResult {
  taskId: string;
  status: 'pending' | 'completed' | 'failed' | 'retry';
  output?: any;
  error_message?: string;
  execution_time_ms?: number;
  retry_count?: number;
}

class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private performanceMetrics: Map<string, any> = new Map();
  private retryQueue: AgentTask[] = [];
  private processingQueue: Set<string> = new Set();

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  async executeTask(task: AgentTask): Promise<AgentExecutionResult> {
    const taskId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      // Prevent duplicate task execution
      const taskKey = `${task.agentType}-${task.taskType}-${JSON.stringify(task.context)}`;
      if (this.processingQueue.has(taskKey)) {
        logger.warn('Task already processing, skipping duplicate:', taskKey);
        return {
          taskId,
          status: 'pending',
          error_message: 'Task already processing'
        };
      }

      this.processingQueue.add(taskKey);

      // Log task start
      await this.logAgentTask(taskId, task, 'pending', startTime);

      // Execute the agent task based on type
      let result: any;
      switch (task.agentType) {
        case 'salesAgent_v1':
          result = await this.executeSalesAgent(task);
          break;
        case 'managerAgent_v1':
          result = await this.executeManagerAgent(task);
          break;
        case 'automationAgent_v1':
          result = await this.executeAutomationAgent(task);
          break;
        case 'developerAgent_v1':
          result = await this.executeDeveloperAgent(task);
          break;
        default:
          throw new Error(`Unknown agent type: ${task.agentType}`);
      }

      const executionTime = Date.now() - startTime;

      // Record success
      await relevanceAIConnection.recordAgentSuccess(task.agentType);
      
      // Update performance metrics
      this.updatePerformanceMetrics(task.agentType, executionTime, true);
      
      // Log completion
      await this.logAgentTask(taskId, task, 'completed', startTime, result, executionTime);

      this.processingQueue.delete(taskKey);

      return {
        taskId,
        status: 'completed',
        output: result,
        execution_time_ms: executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Record error
      await relevanceAIConnection.recordAgentError(task.agentType, errorMessage);
      
      // Update performance metrics
      this.updatePerformanceMetrics(task.agentType, executionTime, false);
      
      // Log failure
      await this.logAgentTask(taskId, task, 'failed', startTime, null, executionTime, errorMessage);

      // Add to retry queue if not too many retries
      const retryCount = (task as any).retryCount || 0;
      if (retryCount < 3) {
        (task as any).retryCount = retryCount + 1;
        this.retryQueue.push(task);
        logger.info(`Task ${taskId} added to retry queue (attempt ${retryCount + 1})`);
      }

      this.processingQueue.delete(`${task.agentType}-${task.taskType}-${JSON.stringify(task.context)}`);

      return {
        taskId,
        status: 'failed',
        error_message: errorMessage,
        execution_time_ms: executionTime,
        retry_count: retryCount
      };
    }
  }

  private async executeSalesAgent(task: AgentTask): Promise<any> {
    logger.info('Executing sales agent task:', task.taskType);
    
    // Call Relevance AI function
    const { data, error } = await supabase.functions.invoke('relevance-ai', {
      body: {
        action: 'execute_workflow',
        data: {
          workflowId: 'salesAgent_v1',
          input: {
            taskType: task.taskType,
            context: task.context,
            timestamp: new Date().toISOString()
          },
          userId: task.context.userId
        }
      }
    });

    if (error) {
      throw new Error(`Sales agent execution failed: ${error.message}`);
    }

    // Update sales agent memory if needed
    if (task.context.currentLead) {
      await this.updateSalesAgentMemory(task.context.currentLead.id, {
        last_contact: new Date().toISOString(),
        stage: task.taskType,
        notes: data?.result?.summary || 'AI task completed',
        outcome: data?.result?.outcome || 'processed',
        follow_up_sent: task.taskType.includes('follow_up'),
        escalation_flag: data?.result?.needsEscalation || false
      });
    }

    return data?.result || { success: true, message: 'Sales agent task completed' };
  }

  private async executeManagerAgent(task: AgentTask): Promise<any> {
    logger.info('Executing manager agent task:', task.taskType);
    
    const { data, error } = await supabase.functions.invoke('relevance-ai', {
      body: {
        action: 'execute_workflow',
        data: {
          workflowId: 'managerAgent_v1',
          input: {
            taskType: task.taskType,
            context: task.context,
            timestamp: new Date().toISOString()
          },
          userId: task.context.userId
        }
      }
    });

    if (error) {
      throw new Error(`Manager agent execution failed: ${error.message}`);
    }

    return data?.result || { success: true, message: 'Manager agent task completed' };
  }

  private async executeAutomationAgent(task: AgentTask): Promise<any> {
    logger.info('Executing automation agent task:', task.taskType);
    
    const { data, error } = await supabase.functions.invoke('relevance-ai', {
      body: {
        action: 'execute_workflow',
        data: {
          workflowId: 'automationAgent_v1',
          input: {
            taskType: task.taskType,
            context: task.context,
            timestamp: new Date().toISOString()
          },
          userId: task.context.userId
        }
      }
    });

    if (error) {
      throw new Error(`Automation agent execution failed: ${error.message}`);
    }

    // Log to automation agent memory
    await this.updateAutomationAgentMemory(crypto.randomUUID(), {
      event_type: task.taskType,
      input_data: task.context,
      status: 'completed',
      trigger_timestamp: new Date().toISOString(),
      resolution_time: data?.execution_time || 1000
    });

    return data?.result || { success: true, message: 'Automation agent task completed' };
  }

  private async executeDeveloperAgent(task: AgentTask): Promise<any> {
    logger.info('Executing developer agent task:', task.taskType);
    
    const { data, error } = await supabase.functions.invoke('relevance-ai', {
      body: {
        action: 'execute_workflow',
        data: {
          workflowId: 'developerAgent_v1',
          input: {
            taskType: task.taskType,
            context: task.context,
            timestamp: new Date().toISOString()
          },
          userId: task.context.userId
        }
      }
    });

    if (error) {
      throw new Error(`Developer agent execution failed: ${error.message}`);
    }

    return data?.result || { success: true, message: 'Developer agent task completed' };
  }

  private async updateSalesAgentMemory(leadId: string, data: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('salesagent_memory')
        .upsert({
          lead_id: leadId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to update sales agent memory:', error);
      }
    } catch (error) {
      logger.error('Error updating sales agent memory:', error);
    }
  }

  private async updateAutomationAgentMemory(automationId: string, data: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('automationagent_memory')
        .upsert({
          automation_id: automationId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to update automation agent memory:', error);
      }
    } catch (error) {
      logger.error('Error updating automation agent memory:', error);
    }
  }

  private async logAgentTask(
    taskId: string,
    task: AgentTask,
    status: string,
    startTime: number,
    output?: any,
    executionTime?: number,
    errorMessage?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_tasks')
        .upsert({
          id: taskId,
          agent_type: task.agentType,
          task_type: task.taskType,
          status,
          input_payload: task.context,
          output_payload: output,
          user_id: task.context.userId,
          company_id: task.context.companyId,
          execution_time_ms: executionTime,
          error_message: errorMessage,
          started_at: new Date(startTime).toISOString(),
          completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null
        });

      if (error) {
        logger.error('Failed to log agent task:', error);
      }
    } catch (error) {
      logger.error('Error logging agent task:', error);
    }
  }

  private updatePerformanceMetrics(agentType: string, executionTime: number, success: boolean): void {
    const key = `${agentType}-general`;
    const current = this.performanceMetrics.get(key) || {
      totalExecutions: 0,
      successCount: 0,
      totalTime: 0,
      averageTime: 0
    };

    current.totalExecutions++;
    if (success) current.successCount++;
    current.totalTime += executionTime;
    current.averageTime = current.totalTime / current.totalExecutions;

    this.performanceMetrics.set(key, current);
  }

  getPerformanceMetrics(): Map<string, any> {
    return this.performanceMetrics;
  }

  async processRetryQueue(): Promise<void> {
    if (this.retryQueue.length === 0) return;

    logger.info(`Processing retry queue with ${this.retryQueue.length} tasks`);
    
    const tasksToRetry = [...this.retryQueue];
    this.retryQueue = [];

    for (const task of tasksToRetry) {
      try {
        await this.executeTask(task);
      } catch (error) {
        logger.error('Retry execution failed:', error);
      }
    }
  }
}

export const agentOrchestrator = AgentOrchestrator.getInstance();
