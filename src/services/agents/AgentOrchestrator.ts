
import { logger } from '@/utils/logger';
import { relevanceAI } from '@/services/relevance/RelevanceAIService';
import type { AgentResponse } from '@/services/relevance/RelevanceAIService';

export interface AgentContext {
  workspace: string;
  currentLead?: any;
  teamData?: any;
  userRole: string;
  companyId: string;
  userId: string;
  recentActions?: any[];
  tone?: string;
  industry?: string;
  salesHistory?: any[];
  recentFeedback?: any[];
  managerContext?: any;
}

export interface AgentTask {
  agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1';
  taskType: string;
  context: AgentContext;
  priority?: 'low' | 'medium' | 'high';
}

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private performanceMetrics = new Map<string, any>();

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  async executeAgentWorkflow(
    agentType: 'sales' | 'manager' | 'support',
    task: string,
    context: AgentContext,
    feedback?: { rating: number; comment?: string }
  ): Promise<AgentResponse> {
    try {
      logger.info(`Executing ${agentType} agent workflow: ${task}`);

      // Map agent types to workflow IDs
      const workflowMap = {
        sales: 'sales-agent-v1',
        manager: 'manager-agent-v1',
        support: 'support-agent-v1'
      };

      const workflowId = workflowMap[agentType];
      if (!workflowId) {
        throw new Error(`Unknown agent type: ${agentType}`);
      }

      // Prepare enriched context
      const enrichedContext = await this.enrichContext(context, agentType);

      // Execute the workflow
      const result = await relevanceAI.executeAgent(workflowId, {
        task,
        context: enrichedContext,
        feedback,
        timestamp: new Date().toISOString()
      });

      // Process and return result
      return this.processAgentResponse(result, agentType, task);

    } catch (error) {
      logger.error('Agent workflow execution failed:', error);
      throw error;
    }
  }

  async executeTask(task: AgentTask): Promise<AgentResponse> {
    try {
      const startTime = Date.now();
      
      // Map new agent types to workflow IDs
      const workflowMap = {
        salesAgent_v1: 'sales-agent-v1',
        managerAgent_v1: 'manager-agent-v1',
        automationAgent_v1: 'automation-agent-v1',
        developerAgent_v1: 'developer-agent-v1'
      };

      const workflowId = workflowMap[task.agentType];
      if (!workflowId) {
        throw new Error(`Unknown agent type: ${task.agentType}`);
      }

      const result = await relevanceAI.executeAgent(workflowId, {
        taskType: task.taskType,
        context: task.context,
        priority: task.priority,
        timestamp: new Date().toISOString()
      });

      const executionTime = Date.now() - startTime;
      
      // Update performance metrics
      this.updatePerformanceMetrics(task.agentType, executionTime, result.success);

      return {
        ...result,
        executionTime
      };

    } catch (error) {
      logger.error('Task execution failed:', error);
      throw error;
    }
  }

  async submitFeedback(userId: string, taskId: string, rating: 'positive' | 'negative', correction?: string): Promise<void> {
    try {
      logger.info('Submitting feedback:', { userId, taskId, rating, correction });
      
      // In a real implementation, this would send feedback to the AI service
      // For now, we'll just log it
      
    } catch (error) {
      logger.error('Failed to submit feedback:', error);
      throw error;
    }
  }

  getPerformanceMetrics(): Map<string, any> {
    return this.performanceMetrics;
  }

  private updatePerformanceMetrics(agentType: string, executionTime: number, success: boolean) {
    const current = this.performanceMetrics.get(agentType) || {
      totalExecutions: 0,
      successfulExecutions: 0,
      totalTime: 0,
      averageTime: 0
    };

    current.totalExecutions += 1;
    if (success) {
      current.successfulExecutions += 1;
    }
    current.totalTime += executionTime;
    current.averageTime = current.totalTime / current.totalExecutions;

    this.performanceMetrics.set(agentType, current);
  }

  private async enrichContext(context: AgentContext, agentType: string): Promise<any> {
    const enriched = { ...context };

    try {
      switch (agentType) {
        case 'sales':
          enriched.salesHistory = context.salesHistory || [];
          enriched.recentFeedback = context.recentFeedback || [];
          break;
        case 'manager':
          enriched.managerContext = context.managerContext || {};
          break;
      }

      return enriched;
    } catch (error) {
      logger.error('Context enrichment failed:', error);
      return context;
    }
  }

  private processAgentResponse(response: AgentResponse, agentType: string, task: string): AgentResponse {
    try {
      // Add metadata to response
      const processedResponse = {
        ...response,
        metadata: {
          agentType,
          task,
          processedAt: new Date().toISOString(),
          taskId: response.output?.taskId || crypto.randomUUID()
        }
      };

      return processedResponse;
    } catch (error) {
      logger.error('Response processing failed:', error);
      return response;
    }
  }

  async getAgentHealth(): Promise<{ [key: string]: any }> {
    try {
      return await relevanceAI.getAgentHealth();
    } catch (error) {
      logger.error('Failed to get agent health:', error);
      return {};
    }
  }
}

export const agentOrchestrator = AgentOrchestrator.getInstance();
