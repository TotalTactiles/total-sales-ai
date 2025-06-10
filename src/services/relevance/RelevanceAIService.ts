
import { logger } from '@/utils/logger';

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
  private retryAttempts = 3;
  private retryDelay = 1000;

  async initialize(config: RelevanceAIConfig) {
    this.config = config;
    logger.info('Relevance AI service initialized');
  }

  async executeWorkflow(workflowId: string, input: any, userId: string): Promise<WorkflowExecution> {
    if (!this.config) {
      throw new Error('Relevance AI not configured');
    }

    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}`,
      workflowId,
      status: 'running',
      input,
      startTime: new Date()
    };

    try {
      const response = await this.makeRequest(`/workflows/${workflowId}/execute`, {
        method: 'POST',
        body: JSON.stringify({ input, userId })
      });

      execution.status = 'completed';
      execution.output = response;
      execution.endTime = new Date();

      logger.info('Workflow executed successfully', { workflowId, executionId: execution.id });
      return execution;

    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.endTime = new Date();
      
      logger.error('Workflow execution failed', { workflowId, error });
      throw error;
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    if (!this.config) {
      throw new Error('Relevance AI not configured');
    }

    try {
      const response = await this.makeRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          context,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      return response.content;
    } catch (error) {
      logger.error('Failed to generate AI response', { error });
      throw error;
    }
  }

  async listWorkflows(): Promise<AgentWorkflow[]> {
    if (!this.config) {
      return [];
    }

    try {
      const response = await this.makeRequest('/workflows');
      return response.workflows || [];
    } catch (error) {
      logger.error('Failed to list workflows', { error });
      return [];
    }
  }

  async createWorkflow(workflow: Partial<AgentWorkflow>): Promise<AgentWorkflow> {
    if (!this.config) {
      throw new Error('Relevance AI not configured');
    }

    try {
      const response = await this.makeRequest('/workflows', {
        method: 'POST',
        body: JSON.stringify(workflow)
      });

      logger.info('Workflow created', { workflowId: response.id });
      return response;
    } catch (error) {
      logger.error('Failed to create workflow', { error });
      throw error;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config) {
      throw new Error('Relevance AI not configured');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers
        });

        if (response.status === 429) {
          // Rate limited - wait and retry
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw error;
        }
        
        logger.warn(`Relevance AI request failed, attempt ${attempt}/${this.retryAttempts}`, { error });
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }
}

export const relevanceAI = new RelevanceAIService();
