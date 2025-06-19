import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

export interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastHealthCheck: Date;
  responseTimeMs?: number;
  errorCount: number;
  successCount: number;
}

export interface ConnectionHealth {
  apiConnected: boolean;
  agentsRegistered: AgentStatus[];
  lastUpdate: Date;
}

class RelevanceAIConnectionService {
  private static instance: RelevanceAIConnectionService;
  private healthStatus: ConnectionHealth;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.healthStatus = {
      apiConnected: false,
      agentsRegistered: [],
      lastUpdate: new Date()
    };
  }

  static getInstance(): RelevanceAIConnectionService {
    if (!RelevanceAIConnectionService.instance) {
      RelevanceAIConnectionService.instance = new RelevanceAIConnectionService();
    }
    return RelevanceAIConnectionService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      logger.info('Initializing Relevance AI connection...');
      
      // Initialize default agents
      await this.registerDefaultAgents();
      
      // Start health check monitoring
      this.startHealthMonitoring();
      
      // Perform initial health check
      const isHealthy = await this.performHealthCheck();
      
      if (isHealthy) {
        logger.info('Relevance AI connection initialized successfully');
        return true;
      } else {
        logger.warn('Relevance AI connection initialized with warnings');
        return false;
      }
    } catch (error) {
      logger.error('Failed to initialize Relevance AI connection:', error);
      return false;
    }
  }

  getHealthStatus(): ConnectionHealth {
    return this.healthStatus;
  }

  getAgentStatus(agentId: string): AgentStatus | null {
    return this.healthStatus.agentsRegistered.find(agent => agent.id === agentId) || null;
  }

  async recordAgentSuccess(agentId: string): Promise<void> {
    const agent = this.healthStatus.agentsRegistered.find(a => a.id === agentId);
    if (agent) {
      agent.successCount++;
      agent.status = 'active';
      agent.lastHealthCheck = new Date();
      await this.updateAgentStatus(agent);
    }
  }

  async recordAgentError(agentId: string, error: string): Promise<void> {
    const agent = this.healthStatus.agentsRegistered.find(a => a.id === agentId);
    if (agent) {
      agent.errorCount++;
      agent.status = agent.errorCount > 3 ? 'error' : 'active';
      agent.lastHealthCheck = new Date();
      await this.updateAgentStatus(agent);
      
      logger.error(`Agent ${agentId} error recorded:`, error);
    }
  }

  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  private async registerDefaultAgents(): Promise<void> {
    const defaultAgents: Omit<AgentStatus, 'lastHealthCheck'>[] = [
      {
        id: 'salesAgent_v1',
        name: 'Sales Agent',
        status: 'active',
        errorCount: 0,
        successCount: 0
      },
      {
        id: 'managerAgent_v1',
        name: 'Manager Agent',
        status: 'active',
        errorCount: 0,
        successCount: 0
      },
      {
        id: 'automationAgent_v1',
        name: 'Automation Agent',
        status: 'active',
        errorCount: 0,
        successCount: 0
      },
      {
        id: 'developerAgent_v1',
        name: 'Developer Agent',
        status: 'active',
        errorCount: 0,
        successCount: 0
      }
    ];

    this.healthStatus.agentsRegistered = defaultAgents.map(agent => ({
      ...agent,
      lastHealthCheck: new Date()
    }));

    // Update database
    for (const agent of this.healthStatus.agentsRegistered) {
      await this.updateAgentStatus(agent);
    }
  }

  private async updateAgentStatus(agent: AgentStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_status')
        .upsert({
          agent_name: agent.id,
          status: agent.status,
          last_health_check: agent.lastHealthCheck.toISOString(),
          response_time_ms: agent.responseTimeMs || null,
          error_count: agent.errorCount,
          success_count: agent.successCount,
          metadata: {
            name: agent.name,
            lastUpdate: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to update agent status:', error);
      }
    } catch (error) {
      logger.error('Error updating agent status:', error);
    }
  }

  async performHealthCheck(): Promise<boolean> {
    try {
      logger.info('Performing Relevance AI health check...');
      
      // Test Relevance AI connection
      const connectionTest = await this.testRelevanceConnection();
      this.healthStatus.apiConnected = connectionTest;
      
      // Check each agent
      for (const agent of this.healthStatus.agentsRegistered) {
        const agentHealth = await this.checkAgentHealth(agent.id);
        agent.status = agentHealth.status;
        agent.lastHealthCheck = new Date();
        agent.responseTimeMs = agentHealth.responseTimeMs;
        
        // Update database
        await this.updateAgentStatus(agent);
      }
      
      this.healthStatus.lastUpdate = new Date();
      
      const healthyAgents = this.healthStatus.agentsRegistered.filter(a => a.status === 'active').length;
      const totalAgents = this.healthStatus.agentsRegistered.length;
      
      logger.info('Health check completed', {
        apiConnected: this.healthStatus.apiConnected,
        healthyAgents: `${healthyAgents}/${totalAgents}`
      });
      
      return this.healthStatus.apiConnected && healthyAgents > 0;
    } catch (error) {
      logger.error('Health check failed:', error);
      this.healthStatus.apiConnected = false;
      return false;
    }
  }

  private async testRelevanceConnection(): Promise<boolean> {
    try {
      // Test with a simple function call to relevance-ai edge function
      const { data, error } = await supabase.functions.invoke('relevance-ai', {
        body: { action: 'health_check' }
      });

      if (error) {
        logger.warn('Relevance AI connection test failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Relevance AI connection test error:', error);
      return false;
    }
  }

  private async checkAgentHealth(agentId: string): Promise<{ status: 'active' | 'inactive' | 'error', responseTimeMs?: number }> {
    const startTime = Date.now();
    
    try {
      // Simulate agent health check - in production this would call the actual agent
      const { data, error } = await supabase.functions.invoke('relevance-ai', {
        body: { 
          action: 'agent_health_check',
          agentId 
        }
      });

      const responseTime = Date.now() - startTime;

      if (error) {
        return { status: 'error', responseTimeMs: responseTime };
      }

      return { status: 'active', responseTimeMs: responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(`Agent ${agentId} health check failed:`, error);
      return { status: 'error', responseTimeMs: responseTime };
    }
  }

  private startHealthMonitoring(): void {
    // Clear existing interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Start new monitoring every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }
}

export const relevanceAIConnection = RelevanceAIConnectionService.getInstance();
