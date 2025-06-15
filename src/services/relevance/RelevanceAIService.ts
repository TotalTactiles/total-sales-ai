
import { logger } from '@/utils/logger';
import { relevanceAIAgent } from './RelevanceAIAgentService';

export interface RelevanceAIConfig {
  apiKey: string;
  baseUrl: string;
  region: string;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'lead_followup' | 'objection_handling' | 'pipeline_automation' | 'analysis';
  status: 'active' | 'paused' | 'draft';
  successRate: number;
  lastRun: Date;
  triggers: string[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  input: any;
  output?: any;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export interface UsageTier {
  name: 'Basic' | 'Pro' | 'Elite';
  monthlyRequests: number;
  price: number;
  features: string[];
}

export const USAGE_TIERS: UsageTier[] = [
  {
    name: 'Basic',
    monthlyRequests: 100,
    price: 0,
    features: ['Basic workflows', 'Lead summaries', 'Simple automation']
  },
  {
    name: 'Pro',
    monthlyRequests: 500,
    price: 49,
    features: ['Advanced workflows', 'A/B testing', 'Real-time assistance', 'Custom triggers']
  },
  {
    name: 'Elite',
    monthlyRequests: 1500,
    price: 129,
    features: ['Unlimited workflows', 'Advanced analytics', 'Team management', 'Priority support']
  }
];

class RelevanceAIService {
  private config: RelevanceAIConfig | null = null;

  async initialize(config: RelevanceAIConfig) {
    this.config = config;
    logger.info('Relevance AI service initialized');
    
    // Perform initial health check
    await this.performSystemHealthCheck();
  }

  async executeWorkflow(workflowId: string, input: any, userId: string): Promise<WorkflowExecution> {
    if (!this.config) {
      throw new Error('Relevance AI not configured');
    }

    try {
      // Use the enhanced agent service for execution
      const task = await relevanceAIAgent.executeAgentTask(
        'salesAgent_v1',
        this.mapWorkflowToTaskType(workflowId),
        input,
        userId,
        await this.getCurrentCompanyId()
      );

      // Convert agent task to workflow execution format
      const execution: WorkflowExecution = {
        id: task.id,
        workflowId,
        status: this.mapTaskStatusToWorkflowStatus(task.status),
        input: task.input_payload,
        output: task.output_payload,
        startTime: task.started_at,
        endTime: task.completed_at,
        error: task.error_message
      };

      logger.info('Workflow executed via agent service', { workflowId, executionId: execution.id });
      return execution;

    } catch (error) {
      logger.error('Workflow execution failed', { workflowId, error });
      throw error;
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    if (!this.config) {
      throw new Error('Relevance AI not configured');
    }

    try {
      const task = await relevanceAIAgent.executeAgentTask(
        'salesAgent_v1',
        'text_generation',
        { prompt, context },
        await this.getCurrentUserId(),
        await this.getCurrentCompanyId()
      );

      if (task.status === 'completed' && task.output_payload?.response) {
        return task.output_payload.response;
      } else {
        throw new Error(task.error_message || 'Failed to generate response');
      }
    } catch (error) {
      logger.error('Failed to generate AI response', { error });
      throw error;
    }
  }

  async listWorkflows(): Promise<AgentWorkflow[]> {
    // Return predefined workflows based on available agent capabilities
    return [
      {
        id: 'lead_intelligence_workflow',
        name: 'Lead Intelligence Analysis',
        description: 'Analyze lead behavior patterns and suggest next actions',
        category: 'analysis',
        status: 'active',
        successRate: 87,
        lastRun: new Date(),
        triggers: ['new_lead', 'lead_update', 'status_change']
      },
      {
        id: 'follow_up_sequence_workflow',
        name: 'Smart Follow-up Generator',
        description: 'Generate personalized follow-up messages based on lead context',
        category: 'lead_followup',
        status: 'active',
        successRate: 92,
        lastRun: new Date(),
        triggers: ['no_response', 'meeting_scheduled', 'demo_completed']
      },
      {
        id: 'objection_response_workflow',
        name: 'Objection Handler',
        description: 'Provide intelligent responses to common sales objections',
        category: 'objection_handling',
        status: 'active',
        successRate: 89,
        lastRun: new Date(),
        triggers: ['objection_detected', 'manual_trigger']
      },
      {
        id: 'email_generation_workflow',
        name: 'Email Draft Assistant',
        description: 'Generate professional email drafts for any scenario',
        category: 'pipeline_automation',
        status: 'active',
        successRate: 94,
        lastRun: new Date(),
        triggers: ['manual_trigger', 'scheduled_follow_up']
      }
    ];
  }

  async createWorkflow(workflow: Partial<AgentWorkflow>): Promise<AgentWorkflow> {
    if (!this.config) {
      throw new Error('Relevance AI not configured');
    }

    // For now, return a mock workflow - in production this would create actual workflows
    const newWorkflow: AgentWorkflow = {
      id: `custom_workflow_${Date.now()}`,
      name: workflow.name || 'Custom Workflow',
      description: workflow.description || 'Custom workflow created by user',
      category: workflow.category || 'analysis',
      status: 'draft',
      successRate: 0,
      lastRun: new Date(),
      triggers: workflow.triggers || []
    };

    logger.info('Workflow created', { workflowId: newWorkflow.id });
    return newWorkflow;
  }

  async performSystemHealthCheck(): Promise<void> {
    try {
      // Perform health checks on all registered agents
      const agents = ['salesAgent_v1', 'managerAgent_v1', 'automationAgent_v1'];
      
      const healthCheckPromises = agents.map(agent => 
        relevanceAIAgent.performHealthCheck(agent)
      );

      const results = await Promise.allSettled(healthCheckPromises);
      
      const failedChecks = results.filter(result => result.status === 'rejected');
      
      if (failedChecks.length > 0) {
        logger.warn(`${failedChecks.length} agent health checks failed`, { 
          failedAgents: failedChecks.length 
        });
      } else {
        logger.info('All agent health checks passed');
      }
    } catch (error) {
      logger.error('System health check failed', { error });
    }
  }

  // Utility methods
  private mapWorkflowToTaskType(workflowId: string): string {
    const workflowMap: Record<string, string> = {
      'lead_intelligence_workflow': 'lead_analysis',
      'follow_up_sequence_workflow': 'follow_up_generation',
      'objection_response_workflow': 'objection_handling',
      'email_generation_workflow': 'email_draft',
      'call_analysis_workflow': 'call_summary'
    };

    return workflowMap[workflowId] || 'generic_task';
  }

  private mapTaskStatusToWorkflowStatus(taskStatus: string): 'running' | 'completed' | 'failed' | 'queued' {
    switch (taskStatus) {
      case 'in_progress':
      case 'retrying':
        return 'running';
      case 'completed':
        return 'completed';
      case 'failed':
        return 'failed';
      case 'pending':
      default:
        return 'queued';
    }
  }

  private async getCurrentUserId(): Promise<string> {
    // This would get the current user ID from auth context
    // For now, return a placeholder
    return 'current_user_id';
  }

  private async getCurrentCompanyId(): Promise<string> {
    // This would get the current company ID from profile
    // For now, return a placeholder
    return 'current_company_id';
  }
}

export const relevanceAI = new RelevanceAIService();
