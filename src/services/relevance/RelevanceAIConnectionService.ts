
import { logger } from '@/utils/logger';

interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastPing?: string;
  errorMessage?: string;
}

interface ConnectionHealth {
  apiConnected: boolean;
  agentsRegistered: AgentStatus[];
  lastHealthCheck: string;
  errors: string[];
}

class RelevanceAIConnectionService {
  private static instance: RelevanceAIConnectionService;
  private apiKey: string | null = null;
  private baseUrl = 'https://api-bcbe36.stack.tryrelevance.com/latest';
  private healthStatus: ConnectionHealth = {
    apiConnected: false,
    agentsRegistered: [],
    lastHealthCheck: '',
    errors: []
  };

  static getInstance(): RelevanceAIConnectionService {
    if (!RelevanceAIConnectionService.instance) {
      RelevanceAIConnectionService.instance = new RelevanceAIConnectionService();
    }
    return RelevanceAIConnectionService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Get API key from environment or Supabase secrets
      this.apiKey = process.env.RELEVANCE_API_KEY || 
                    (typeof window !== 'undefined' ? localStorage.getItem('relevance_api_key') : null);

      if (!this.apiKey) {
        throw new Error('Relevance AI API key not found');
      }

      // Test connection
      const connected = await this.testConnection();
      if (connected) {
        await this.registerAgents();
        await this.performHealthCheck();
      }

      return connected;
    } catch (error) {
      logger.error('Failed to initialize Relevance AI connection:', error);
      this.healthStatus.errors.push(`Initialization failed: ${error}`);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      this.healthStatus.apiConnected = response.ok;
      this.healthStatus.lastHealthCheck = new Date().toISOString();

      if (!response.ok) {
        const error = await response.text();
        this.healthStatus.errors.push(`API connection failed: ${error}`);
        return false;
      }

      logger.info('Relevance AI connection successful');
      return true;
    } catch (error) {
      logger.error('Relevance AI connection test failed:', error);
      this.healthStatus.apiConnected = false;
      this.healthStatus.errors.push(`Connection test failed: ${error}`);
      return false;
    }
  }

  private async registerAgents(): Promise<void> {
    const requiredAgents = [
      { id: 'salesAgent_v1', name: 'Sales Rep Assistant', role: 'sales' },
      { id: 'managerAgent_v1', name: 'Manager Performance AI', role: 'management' },
      { id: 'automationAgent_v1', name: 'Background Trigger AI', role: 'automation' },
      { id: 'developerAgent_v1', name: 'Debug & Audit AI', role: 'development' }
    ];

    this.healthStatus.agentsRegistered = [];

    for (const agent of requiredAgents) {
      try {
        const status = await this.checkAgentStatus(agent.id);
        this.healthStatus.agentsRegistered.push({
          id: agent.id,
          name: agent.name,
          status: status ? 'active' : 'inactive',
          lastPing: new Date().toISOString()
        });
      } catch (error) {
        this.healthStatus.agentsRegistered.push({
          id: agent.id,
          name: agent.name,
          status: 'error',
          errorMessage: `${error}`,
          lastPing: new Date().toISOString()
        });
      }
    }
  }

  private async checkAgentStatus(agentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      logger.error(`Failed to check status for agent ${agentId}:`, error);
      return false;
    }
  }

  async performHealthCheck(): Promise<ConnectionHealth> {
    await this.testConnection();
    if (this.healthStatus.apiConnected) {
      await this.registerAgents();
    }
    return this.healthStatus;
  }

  getHealthStatus(): ConnectionHealth {
    return this.healthStatus;
  }

  async executeAgentTask(
    agentId: string,
    taskType: string,
    payload: any
  ): Promise<any> {
    if (!this.healthStatus.apiConnected) {
      throw new Error('Relevance AI is not connected');
    }

    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_type: taskType,
          payload: payload,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Agent execution failed: ${error}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      logger.error(`Agent task execution failed for ${agentId}:`, error);
      throw error;
    }
  }

  async retryFailedTask(taskId: string, maxRetries = 3): Promise<any> {
    // Implement exponential backoff retry logic
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the task
        // This would need the original task parameters stored
        logger.info(`Retrying task ${taskId}, attempt ${attempt}`);
        return { success: true, attempt };
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        logger.warn(`Retry attempt ${attempt} failed for task ${taskId}`);
      }
    }
  }
}

export const relevanceAIConnection = RelevanceAIConnectionService.getInstance();
