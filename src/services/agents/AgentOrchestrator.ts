
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

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;

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
