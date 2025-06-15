
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RelevanceAgentConfig {
  apiKey: string;
  baseUrl: string;
  maxRetries: number;
  retryDelay: number;
}

export interface AgentExecutionResult {
  success: boolean;
  taskId: string;
  agentType: string;
  output?: any;
  error?: string;
  executionTime: number;
}

class RelevanceAgentService {
  private config: RelevanceAgentConfig;
  private static instance: RelevanceAgentService;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_RELEVANCE_API_KEY || '',
      baseUrl: 'https://api-bcbe36.stack.tryrelevance.com/latest',
      maxRetries: 3,
      retryDelay: 1000
    };
  }

  static getInstance(): RelevanceAgentService {
    if (!RelevanceAgentService.instance) {
      RelevanceAgentService.instance = new RelevanceAgentService();
    }
    return RelevanceAgentService.instance;
  }

  async executeSalesAgent(taskType: string, payload: any, userId: string, companyId: string): Promise<AgentExecutionResult> {
    return this.executeAgent('salesAgent_v1', taskType, payload, userId, companyId);
  }

  async executeManagerAgent(taskType: string, payload: any, userId: string, companyId: string): Promise<AgentExecutionResult> {
    return this.executeAgent('managerAgent_v1', taskType, payload, userId, companyId);
  }

  async executeAutomationAgent(taskType: string, payload: any, userId: string, companyId: string): Promise<AgentExecutionResult> {
    return this.executeAgent('automationAgent_v1', taskType, payload, userId, companyId);
  }

  async executeDeveloperAgent(taskType: string, payload: any, userId: string, companyId: string): Promise<AgentExecutionResult> {
    return this.executeAgent('developerAgent_v1', taskType, payload, userId, companyId);
  }

  private async executeAgent(
    agentType: string, 
    taskType: string, 
    payload: any, 
    userId: string, 
    companyId: string
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    const taskId = crypto.randomUUID();

    // Log task start
    await this.logAgentTask(taskId, agentType, taskType, 'pending', payload, userId, companyId);

    try {
      // Execute with retry logic
      const result = await this.executeWithRetry(agentType, taskType, payload, taskId);
      const executionTime = Date.now() - startTime;

      // Log success
      await this.logAgentTask(taskId, agentType, taskType, 'completed', payload, userId, companyId, result, executionTime);

      return {
        success: true,
        taskId,
        agentType,
        output: result,
        executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Log failure
      await this.logAgentTask(taskId, agentType, taskType, 'failed', payload, userId, companyId, null, executionTime, errorMessage);
      await this.logAgentFailure(taskId, agentType, errorMessage, this.config.maxRetries);

      return {
        success: false,
        taskId,
        agentType,
        error: errorMessage,
        executionTime
      };
    }
  }

  private async executeWithRetry(agentType: string, taskType: string, payload: any, taskId: string): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.config.baseUrl}/agents/${agentType}/execute`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            task_type: taskType,
            payload: payload,
            task_id: taskId,
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        logger.warn(`Agent execution attempt ${attempt + 1} failed:`, { 
          taskId, 
          agentType, 
          taskType, 
          error: lastError.message 
        });

        if (attempt < this.config.maxRetries - 1) {
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  private async logAgentTask(
    taskId: string,
    agentType: string,
    taskType: string,
    status: string,
    inputPayload: any,
    userId: string,
    companyId: string,
    outputPayload?: any,
    executionTime?: number,
    errorMessage?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_tasks')
        .upsert({
          id: taskId,
          agent_type: agentType,
          task_type: taskType,
          status,
          input_payload: inputPayload,
          output_payload: outputPayload,
          user_id: userId,
          company_id: companyId,
          execution_time_ms: executionTime,
          error_message: errorMessage,
          started_at: new Date().toISOString(),
          completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null
        });

      if (error) {
        logger.error('Failed to log agent task:', error);
      }
    } catch (error) {
      logger.error('Error logging agent task:', error);
    }
  }

  private async logAgentFailure(
    taskId: string,
    agentType: string,
    errorSummary: string,
    retryAttempts: number
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('agent_failures')
        .insert({
          task_id: taskId,
          agent_type: agentType,
          error_summary: errorSummary,
          retry_attempts: retryAttempts,
          escalated: retryAttempts >= this.config.maxRetries,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to log agent failure:', error);
      }
    } catch (error) {
      logger.error('Error logging agent failure:', error);
    }
  }

  // Agent memory management
  async updateSalesAgentMemory(leadId: string, data: any): Promise<void> {
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

  async updateManagerAgentMemory(repId: string, data: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('manageragent_memory')
        .upsert({
          rep_id: repId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to update manager agent memory:', error);
      }
    } catch (error) {
      logger.error('Error updating manager agent memory:', error);
    }
  }

  async updateAutomationAgentMemory(automationId: string, data: any): Promise<void> {
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

  async updateDeveloperAgentMemory(taskId: string, data: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('developeragent_memory')
        .upsert({
          task_id: taskId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to update developer agent memory:', error);
      }
    } catch (error) {
      logger.error('Error updating developer agent memory:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      return response.ok;
    } catch (error) {
      logger.error('Relevance AI health check failed:', error);
      return false;
    }
  }
}

export const relevanceAgentService = RelevanceAgentService.getInstance();
