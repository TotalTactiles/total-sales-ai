import { supabase } from '@/integrations/supabase/client';
import { relevanceAgentService } from '@/services/relevance/RelevanceAgentService';
import { agentInitializationService } from './AgentInitializationService';
import { logger } from '@/utils/logger';

export interface AgentTask {
  id?: string;
  agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1';
  taskType: string;
  context: AgentContext;
  priority: 'low' | 'medium' | 'high';
  scheduledFor?: Date;
}

export interface AgentContext {
  workspace: string;
  userRole: string;
  companyId: string;
  userId: string;
  repName?: string;
  leadId?: string;
  currentLead?: any;
  isCallActive?: boolean;
  callDuration?: number;
  [key: string]: any;
}

export interface AgentTaskResult {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  output_payload?: any;
  error_message?: string;
  execution_time?: number;
  execution_time_ms?: number;
  feedback_flagged?: boolean;
  fallback_triggered?: boolean;
  created_at: string;
  completed_at?: string;
}

export interface FeedbackInput {
  taskId: string;
  rating: 'positive' | 'negative';
  feedback?: string;
}

export interface AgentPerformanceMetrics {
  totalTasks: number;
  successRate: number;
  avgExecutionTime: number;
  lastActive: string;
  agentType: string;
}

class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private taskQueue: AgentTask[] = [];
  private isProcessing = false;
  private performanceMetrics = new Map<string, AgentPerformanceMetrics>();

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  async executeTask(task: AgentTask): Promise<AgentTaskResult> {
    const taskId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      // Log task start
      await this.logTaskStart(taskId, task);

      // Execute task based on agent type
      let result;
      switch (task.agentType) {
        case 'salesAgent_v1':
          result = await relevanceAgentService.executeSalesAgent(
            task.taskType,
            task.context,
            task.context.userId,
            task.context.companyId
          );
          break;
        case 'automationAgent_v1':
          result = await relevanceAgentService.executeAutomationAgent(
            task.taskType,
            task.context,
            task.context.userId,
            task.context.companyId
          );
          break;
        case 'managerAgent_v1':
          result = await relevanceAgentService.executeManagerAgent(
            task.taskType,
            task.context,
            task.context.userId,
            task.context.companyId
          );
          break;
        case 'developerAgent_v1':
          result = await relevanceAgentService.executeDeveloperAgent(
            task.taskType,
            task.context,
            task.context.userId,
            task.context.companyId
          );
          break;
        default:
          throw new Error(`Unknown agent type: ${task.agentType}`);
      }

      const executionTime = Date.now() - startTime;
      
      // Log completion
      await this.logTaskCompletion(taskId, task, result, executionTime);

      // Update performance metrics
      this.updatePerformanceMetrics(task.agentType, executionTime, result.success);

      return {
        id: taskId,
        status: result.success ? 'completed' : 'failed',
        result: result.output,
        output_payload: result.output,
        error_message: result.error,
        execution_time: executionTime,
        execution_time_ms: executionTime,
        feedback_flagged: false,
        fallback_triggered: !result.success,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      await this.logTaskFailure(taskId, task, error.message, executionTime);
      
      // Handle failure escalation
      await this.handleTaskFailure(task, error.message);

      // Update performance metrics
      this.updatePerformanceMetrics(task.agentType, executionTime, false);

      return {
        id: taskId,
        status: 'failed',
        error_message: error.message,
        execution_time: executionTime,
        execution_time_ms: executionTime,
        feedback_flagged: false,
        fallback_triggered: true,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };
    }
  }

  async submitFeedback(userId: string, taskId: string, rating: 'positive' | 'negative', feedback?: string): Promise<void> {
    try {
      await supabase
        .from('agent_feedback')
        .insert({
          task_id: taskId,
          user_id: userId,
          rating,
          feedback_text: feedback,
          created_at: new Date().toISOString()
        });

      // Log feedback for AI learning
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'agent_feedback',
          event_summary: `User feedback: ${rating}`,
          payload: {
            taskId,
            rating,
            feedback,
            timestamp: new Date().toISOString()
          },
          user_id: userId,
          visibility: 'system_only'
        });

    } catch (error) {
      logger.error('Failed to submit feedback:', error);
      throw error;
    }
  }

  getPerformanceMetrics(): Map<string, AgentPerformanceMetrics> {
    return this.performanceMetrics;
  }

  private updatePerformanceMetrics(agentType: string, executionTime: number, success: boolean): void {
    const current = this.performanceMetrics.get(agentType) || {
      totalTasks: 0,
      successRate: 0,
      avgExecutionTime: 0,
      lastActive: new Date().toISOString(),
      agentType
    };

    current.totalTasks += 1;
    current.avgExecutionTime = (current.avgExecutionTime + executionTime) / 2;
    current.successRate = success ? 
      (current.successRate + 1) / current.totalTasks : 
      current.successRate * (current.totalTasks - 1) / current.totalTasks;
    current.lastActive = new Date().toISOString();

    this.performanceMetrics.set(agentType, current);
  }

  async scheduleTask(task: AgentTask, delay: number = 0): Promise<void> {
    const scheduledTask = {
      ...task,
      id: crypto.randomUUID(),
      scheduledFor: new Date(Date.now() + delay)
    };

    this.taskQueue.push(scheduledTask);
    
    if (delay === 0) {
      this.processQueue();
    } else {
      setTimeout(() => this.processQueue(), delay);
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const now = new Date();
      const readyTasks = this.taskQueue.filter(task => 
        !task.scheduledFor || task.scheduledFor <= now
      );

      for (const task of readyTasks) {
        await this.executeTask(task);
        this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
      }
    } catch (error) {
      logger.error('Queue processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async monitorSystemHealth(): Promise<void> {
    try {
      const healthCheck = await relevanceAgentService.healthCheck();
      
      if (!healthCheck) {
        await this.escalateSystemIssue('AI Agent Service Health Check Failed');
      }

      // Check for failed tasks in the last hour
      const { data: failedTasks } = await supabase
        .from('ai_agent_tasks')
        .select('*')
        .eq('status', 'failed')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      if (failedTasks && failedTasks.length > 5) {
        await this.escalateSystemIssue(`High failure rate: ${failedTasks.length} failed tasks in the last hour`);
      }

    } catch (error) {
      logger.error('System health monitoring error:', error);
      await this.escalateSystemIssue(`Health monitoring failed: ${error.message}`);
    }
  }

  private async logTaskStart(taskId: string, task: AgentTask): Promise<void> {
    try {
      await supabase
        .from('ai_agent_tasks')
        .insert({
          id: taskId,
          agent_type: task.agentType,
          task_type: task.taskType,
          status: 'pending',
          input_payload: task.context,
          user_id: task.context.userId,
          company_id: task.context.companyId,
          started_at: new Date().toISOString()
        });
    } catch (error) {
      logger.error('Failed to log task start:', error);
    }
  }

  private async logTaskCompletion(taskId: string, task: AgentTask, result: any, executionTime: number): Promise<void> {
    try {
      await supabase
        .from('ai_agent_tasks')
        .update({
          status: result.success ? 'completed' : 'failed',
          output_payload: result.output,
          error_message: result.error,
          execution_time_ms: executionTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);
    } catch (error) {
      logger.error('Failed to log task completion:', error);
    }
  }

  private async logTaskFailure(taskId: string, task: AgentTask, errorMessage: string, executionTime: number): Promise<void> {
    try {
      await supabase
        .from('ai_agent_tasks')
        .update({
          status: 'failed',
          error_message: errorMessage,
          execution_time_ms: executionTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);
    } catch (error) {
      logger.error('Failed to log task failure:', error);
    }
  }

  private async handleTaskFailure(task: AgentTask, errorMessage: string): Promise<void> {
    // Check if this is a critical failure that needs immediate attention
    const criticalErrors = ['timeout', 'service_unavailable', 'authentication_failed'];
    const isCritical = criticalErrors.some(error => errorMessage.toLowerCase().includes(error));

    if (isCritical) {
      await this.escalateSystemIssue(`Critical task failure: ${errorMessage}`);
    }

    // Log for developer agent review
    await supabase
      .from('ai_brain_logs')
      .insert({
        type: 'task_failure',
        event_summary: `Task failed: ${task.taskType}`,
        payload: {
          agentType: task.agentType,
          taskType: task.taskType,
          errorMessage,
          context: task.context,
          timestamp: new Date().toISOString()
        },
        company_id: task.context.companyId,
        visibility: 'admin_only'
      });
  }

  private async escalateSystemIssue(issue: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: null, // System notification
          company_id: null,
          type: 'system_alert',
          title: 'System Orchestrator Alert',
          message: issue,
          metadata: {
            escalationType: 'system_health',
            requiresDevAttention: true,
            timestamp: new Date().toISOString()
          }
        });

      // Also send to developer agent for automated handling
      await relevanceAgentService.executeDeveloperAgent(
        'handle_system_escalation',
        { issue, timestamp: new Date().toISOString() },
        'system',
        'system'
      );

    } catch (error) {
      logger.error('Failed to escalate system issue:', error);
    }
  }
}

export const agentOrchestrator = AgentOrchestrator.getInstance();
