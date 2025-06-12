
import { logger } from '@/utils/logger';

interface AgentConfig {
  id: string;
  name: string;
  role: string;
  description: string;
}

interface AgentTask {
  agentId: string;
  taskType: string;
  payload: any;
  context?: any;
}

interface AgentResponse {
  success: boolean;
  output: any;
  executionTime: number;
  agentId: string;
  taskId: string;
}

class RelevanceAIService {
  private static instance: RelevanceAIService;
  private apiKey: string | null = null;
  private baseUrl = 'https://api-bcbe36.stack.tryrelevance.com/latest';
  
  private agents: AgentConfig[] = [
    {
      id: 'salesAgent_v1',
      name: 'Closer',
      role: 'sales',
      description: 'Handles all sales lead comms, follow-ups, pipeline logic, objection-handling'
    },
    {
      id: 'managerAgent_v1', 
      name: 'Director',
      role: 'manager',
      description: 'Tracks reps, assigns tasks, enforces accountability, reviews pipeline lag'
    },
    {
      id: 'automationAgent_v1',
      name: 'Atlas', 
      role: 'automation',
      description: 'Silent backend operator — triggers agents, schedules follow-ups, retries failures'
    },
    {
      id: 'developerAgent_v1',
      name: 'Nova',
      role: 'developer', 
      description: 'Monitors all agents, resolves bugs, manages self-healing + error recovery'
    }
  ];

  static getInstance(): RelevanceAIService {
    if (!RelevanceAIService.instance) {
      RelevanceAIService.instance = new RelevanceAIService();
    }
    return RelevanceAIService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Get API key from environment
      this.apiKey = process.env.RELEVANCE_API_KEY || 
                    (typeof window !== 'undefined' ? localStorage.getItem('relevance_api_key') : null);

      if (!this.apiKey) {
        logger.warn('Relevance AI API key not found, using mock mode');
        return false;
      }

      // Test connection
      const isConnected = await this.testConnection();
      if (isConnected) {
        await this.ensureAgentsExist();
      }

      return isConnected;
    } catch (error) {
      logger.error('Failed to initialize Relevance AI:', error);
      return false;
    }
  }

  private async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      logger.error('Relevance AI connection test failed:', error);
      return false;
    }
  }

  private async ensureAgentsExist(): Promise<void> {
    for (const agent of this.agents) {
      try {
        await this.createOrUpdateAgent(agent);
      } catch (error) {
        logger.error(`Failed to ensure agent ${agent.id} exists:`, error);
      }
    }
  }

  private async createOrUpdateAgent(config: AgentConfig): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${config.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: config.name,
          description: config.description,
          role: config.role,
          metadata: {
            created_by: 'SalesOS',
            version: '1.0'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create/update agent: ${response.statusText}`);
      }

      logger.info(`Agent ${config.id} created/updated successfully`);
    } catch (error) {
      logger.error(`Failed to create/update agent ${config.id}:`, error);
      throw error;
    }
  }

  async executeTask(task: AgentTask): Promise<AgentResponse> {
    const startTime = Date.now();
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Log task initiation
      await this.logAgentTrigger(task.agentId, task.taskType, task.payload, taskId);

      // If no API key, use mock response
      if (!this.apiKey) {
        return this.getMockResponse(task, taskId, Date.now() - startTime);
      }

      const response = await fetch(`${this.baseUrl}/agents/${task.agentId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_type: task.taskType,
          payload: task.payload,
          context: task.context,
          task_id: taskId
        })
      });

      if (!response.ok) {
        throw new Error(`Agent execution failed: ${response.statusText}`);
      }

      const result = await response.json();
      const executionTime = Date.now() - startTime;

      // Log successful execution
      await this.logAgentTrigger(task.agentId, task.taskType, task.payload, taskId, 'success');

      return {
        success: true,
        output: result,
        executionTime,
        agentId: task.agentId,
        taskId
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Log failed execution
      await this.logAgentTrigger(task.agentId, task.taskType, task.payload, taskId, 'error');
      
      logger.error(`Agent task execution failed:`, error);
      
      return {
        success: false,
        output: { error: error instanceof Error ? error.message : 'Unknown error' },
        executionTime,
        agentId: task.agentId,
        taskId
      };
    }
  }

  private getMockResponse(task: AgentTask, taskId: string, executionTime: number): AgentResponse {
    const mockResponses = {
      salesAgent_v1: {
        follow_up: "Follow-up email drafted and ready to send. Suggested timing: tomorrow at 10 AM.",
        call_summary: "Call completed successfully. Next steps: send proposal by Friday.",
        email_draft: "Professional email drafted with personalized touches based on lead profile.",
        objection_handle: "Here are 3 proven responses to that specific objection with supporting data."
      },
      managerAgent_v1: {
        team_summary: "Team performance: 2 reps above target, 1 needs coaching on follow-up timing.",
        agent_analysis: "Top performer: Sarah (conversion 45%). Needs attention: Mike (conversion 12%).",
        lead_routing: "Route this lead to Sarah - best match for this industry and deal size."
      },
      automationAgent_v1: {
        lead_stage_change: "Automation triggered: follow-up scheduled, next touch point set.",
        status_update_trigger: "Status updated and relevant team members notified."
      },
      developerAgent_v1: {
        agent_debug: "No critical issues detected. All agents responding within normal parameters.",
        system_audit: "System health: 98% uptime, average response time: 1.2s.",
        test_task_execution: "Test completed successfully. All endpoints responding correctly."
      }
    };

    const agentResponses = mockResponses[task.agentId as keyof typeof mockResponses] || {};
    const response = agentResponses[task.taskType as keyof typeof agentResponses] || 
                    `Mock response for ${task.taskType} from ${task.agentId}`;

    return {
      success: true,
      output: { response, confidence: 0.95 },
      executionTime,
      agentId: task.agentId,
      taskId
    };
  }

  private async logAgentTrigger(
    agentName: string, 
    triggerType: string, 
    payload: any, 
    taskId: string,
    status: string = 'pending'
  ): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      await supabase
        .from('Agent_Trigger_Logs')
        .insert({
          agent_name: agentName,
          trigger_type: triggerType,
          input_payload: payload,
          triggered_by: taskId,
          result_status: status
        });
    } catch (error) {
      logger.error('Failed to log agent trigger:', error);
    }
  }

  getAgents(): AgentConfig[] {
    return this.agents;
  }

  getAgentHealth(): Record<string, any> {
    return {
      totalAgents: this.agents.length,
      connectedAgents: this.apiKey ? this.agents.length : 0,
      lastHealthCheck: new Date().toISOString(),
      apiKeyConfigured: !!this.apiKey
    };
  }
}

export const relevanceAIService = RelevanceAIService.getInstance();
