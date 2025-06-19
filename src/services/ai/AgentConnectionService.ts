
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

export interface AgentTask {
  id: string;
  agentType: string;
  taskType: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  inputPayload: any;
  outputPayload?: any;
  userId: string;
  companyId: string;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

class AgentConnectionService {
  private static instance: AgentConnectionService;
  private agents: Map<string, AgentStatus> = new Map();

  static getInstance(): AgentConnectionService {
    if (!AgentConnectionService.instance) {
      AgentConnectionService.instance = new AgentConnectionService();
    }
    return AgentConnectionService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      logger.info('Initializing AI Agent Connection Service...');
      
      // Register default agents
      await this.registerDefaultAgents();
      
      // Perform initial health check
      const isHealthy = await this.performHealthCheck();
      
      if (isHealthy) {
        logger.info('AI Agent Connection Service initialized successfully');
        return true;
      } else {
        logger.warn('AI Agent Connection Service initialized with warnings');
        return false;
      }
    } catch (error) {
      logger.error('Failed to initialize AI Agent Connection Service:', error);
      return false;
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

    for (const agent of defaultAgents) {
      const agentWithHealthCheck = {
        ...agent,
        lastHealthCheck: new Date()
      };
      
      this.agents.set(agent.id, agentWithHealthCheck);
      await this.updateAgentStatus(agentWithHealthCheck);
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
      logger.info('Performing AI Agent health check...');
      
      let healthyAgents = 0;
      const totalAgents = this.agents.size;
      
      for (const [agentId, agent] of this.agents) {
        const startTime = Date.now();
        
        try {
          // Simulate agent health check
          const isHealthy = await this.pingAgent(agentId);
          const responseTime = Date.now() - startTime;
          
          if (isHealthy) {
            agent.status = 'active';
            agent.responseTimeMs = responseTime;
            agent.successCount++;
            healthyAgents++;
          } else {
            agent.status = 'error';
            agent.errorCount++;
          }
        } catch (error) {
          logger.error(`Health check failed for agent ${agentId}:`, error);
          agent.status = 'error';
          agent.errorCount++;
        }
        
        agent.lastHealthCheck = new Date();
        await this.updateAgentStatus(agent);
      }
      
      const healthPercentage = (healthyAgents / totalAgents) * 100;
      logger.info(`Health check completed: ${healthyAgents}/${totalAgents} agents healthy (${healthPercentage}%)`);
      
      return healthPercentage >= 75; // Consider healthy if 75% or more agents are active
    } catch (error) {
      logger.error('Error during health check:', error);
      return false;
    }
  }

  private async pingAgent(agentId: string): Promise<boolean> {
    try {
      // Simulate a simple ping to the agent
      // In a real implementation, this would call the actual agent endpoint
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate 95% success rate
          resolve(Math.random() > 0.05);
        }, Math.random() * 1000 + 500); // Random response time between 500-1500ms
      });
    } catch (error) {
      logger.error(`Error pinging agent ${agentId}:`, error);
      return false;
    }
  }

  async createTask(
    agentType: string,
    taskType: string,
    inputPayload: any,
    userId: string,
    companyId: string
  ): Promise<AgentTask | null> {
    try {
      logger.info(`Creating task for agent ${agentType}:`, { taskType, userId });
      
      const taskData = {
        agent_type: agentType,
        task_type: taskType,
        input_payload: inputPayload,
        user_id: userId,
        company_id: companyId,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('ai_agent_tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) {
        logger.error('Error creating agent task:', error);
        return null;
      }

      const task: AgentTask = {
        id: data.id,
        agentType: data.agent_type,
        taskType: data.task_type,
        status: data.status,
        inputPayload: data.input_payload,
        outputPayload: data.output_payload,
        userId: data.user_id,
        companyId: data.company_id,
        createdAt: new Date(data.created_at),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        errorMessage: data.error_message
      };

      // Simulate task execution
      setTimeout(() => this.executeTask(task), 1000);

      return task;
    } catch (error) {
      logger.error('Error creating agent task:', error);
      return null;
    }
  }

  private async executeTask(task: AgentTask): Promise<void> {
    try {
      logger.info(`Executing task ${task.id} for agent ${task.agentType}`);
      
      // Update task status to running
      await supabase
        .from('ai_agent_tasks')
        .update({
          status: 'running',
          started_at: new Date().toISOString()
        })
        .eq('id', task.id);

      // Simulate task execution
      const executionTime = Math.random() * 3000 + 1000; // 1-4 seconds
      await new Promise(resolve => setTimeout(resolve, executionTime));

      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const outputPayload = this.generateMockOutput(task.taskType, task.inputPayload);
        
        await supabase
          .from('ai_agent_tasks')
          .update({
            status: 'completed',
            output_payload: outputPayload,
            completed_at: new Date().toISOString(),
            execution_time_ms: Math.round(executionTime)
          })
          .eq('id', task.id);

        // Update agent success count
        const agent = this.agents.get(task.agentType);
        if (agent) {
          agent.successCount++;
          await this.updateAgentStatus(agent);
        }

        logger.info(`Task ${task.id} completed successfully`);
      } else {
        const errorMessage = 'Simulated task failure';
        
        await supabase
          .from('ai_agent_tasks')
          .update({
            status: 'failed',
            error_message: errorMessage,
            completed_at: new Date().toISOString()
          })
          .eq('id', task.id);

        // Update agent error count
        const agent = this.agents.get(task.agentType);
        if (agent) {
          agent.errorCount++;
          await this.updateAgentStatus(agent);
        }

        logger.error(`Task ${task.id} failed:`, errorMessage);
      }
    } catch (error) {
      logger.error(`Error executing task ${task.id}:`, error);
      
      await supabase
        .from('ai_agent_tasks')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', task.id);
    }
  }

  private generateMockOutput(taskType: string, inputPayload: any): any {
    switch (taskType) {
      case 'lead_analysis':
        return {
          score: Math.floor(Math.random() * 100),
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          insights: ['Strong prospect', 'Needs follow-up', 'Decision maker'][Math.floor(Math.random() * 3)],
          nextActions: ['Schedule call', 'Send proposal', 'Follow up in 3 days'][Math.floor(Math.random() * 3)]
        };
      
      case 'call_summary':
        return {
          summary: 'Call went well. Customer showed interest in the product.',
          sentiment: 'positive',
          nextSteps: ['Send proposal', 'Schedule follow-up'],
          keyPoints: ['Budget confirmed', 'Timeline discussed']
        };
      
      case 'follow_up_generation':
        return {
          subject: 'Following up on our conversation',
          body: 'Hi there! Thanks for taking the time to speak with me today...',
          suggestedSendTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
      
      default:
        return {
          message: 'Task completed successfully',
          timestamp: new Date().toISOString()
        };
    }
  }

  getAgentStatus(agentId: string): AgentStatus | null {
    return this.agents.get(agentId) || null;
  }

  getAllAgents(): AgentStatus[] {
    return Array.from(this.agents.values());
  }
}

export const agentConnectionService = AgentConnectionService.getInstance();
