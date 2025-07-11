
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { AccessControlService } from '@/services/security/accessControlService';
import { EncryptionService } from '@/services/security/encryptionService';

interface AIAgent {
  id: string;
  name: string;
  type: 'voice' | 'text' | 'visual' | 'analytics' | 'decision';
  status: 'active' | 'idle' | 'busy' | 'offline';
  capabilities: string[];
  priority: number;
  lastHeartbeat: Date;
  performance: {
    avgResponseTime: number;
    successRate: number;
    errorCount: number;
  };
}

interface TaskRequest {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  payload: any;
  requiredCapabilities: string[];
  context: {
    userId: string;
    companyId: string;
    sessionId: string;
  };
  deadline?: Date;
  dependencies?: string[];
}

interface TaskResult {
  taskId: string;
  agentId: string;
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
  confidence: number;
}

export class AIOrchestrator {
  private static instance: AIOrchestrator;
  private agents: Map<string, AIAgent> = new Map();
  private activeTasks: Map<string, TaskRequest> = new Map();
  private taskQueue: TaskRequest[] = [];
  private isProcessing = false;

  static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  async initialize(): Promise<void> {
    logger.info('Initializing AI Orchestrator', {}, 'orchestrator');
    
    // Register default agents
    await this.registerAgent({
      id: 'voice-agent-1',
      name: 'Primary Voice AI',
      type: 'voice',
      status: 'active',
      capabilities: ['speech-to-text', 'text-to-speech', 'conversation', 'sentiment-analysis'],
      priority: 1,
      lastHeartbeat: new Date(),
      performance: { avgResponseTime: 200, successRate: 0.95, errorCount: 0 }
    });

    await this.registerAgent({
      id: 'text-agent-1',
      name: 'Primary Text AI',
      type: 'text',
      status: 'active',
      capabilities: ['content-generation', 'summarization', 'translation', 'analysis'],
      priority: 2,
      lastHeartbeat: new Date(),
      performance: { avgResponseTime: 150, successRate: 0.98, errorCount: 0 }
    });

    await this.registerAgent({
      id: 'analytics-agent-1',
      name: 'Analytics AI',
      type: 'analytics',
      status: 'active',
      capabilities: ['data-analysis', 'predictive-modeling', 'pattern-recognition'],
      priority: 3,
      lastHeartbeat: new Date(),
      performance: { avgResponseTime: 500, successRate: 0.92, errorCount: 0 }
    });

    // Start processing loop
    this.startProcessingLoop();
    
    logger.info('AI Orchestrator initialized successfully', {}, 'orchestrator');
  }

  async registerAgent(agent: AIAgent): Promise<void> {
    this.agents.set(agent.id, agent);
    
    await supabase
      .from('ai_agent_status')
      .upsert({
        agent_name: agent.name,
        status: agent.status,
        metadata: {
          type: agent.type,
          capabilities: agent.capabilities,
          priority: agent.priority,
          performance: agent.performance
        },
        last_health_check: agent.lastHeartbeat.toISOString(),
        response_time_ms: agent.performance.avgResponseTime,
        success_count: Math.floor(agent.performance.successRate * 100),
        error_count: agent.performance.errorCount
      });

    logger.info(`Agent registered: ${agent.name}`, { agentId: agent.id }, 'orchestrator');
  }

  async submitTask(request: TaskRequest): Promise<string> {
    // Validate permissions
    const hasAccess = await AccessControlService.checkAccess(
      'ai_orchestration',
      'write',
      await this.getUserRole(request.context.userId)
    );

    if (!hasAccess) {
      throw new Error('Insufficient permissions for AI orchestration');
    }

    // Encrypt sensitive data
    if (request.payload.sensitiveData) {
      request.payload.sensitiveData = await EncryptionService.encryptSensitiveData(
        JSON.stringify(request.payload.sensitiveData)
      );
    }

    this.activeTasks.set(request.id, request);
    this.taskQueue.push(request);
    
    // Sort queue by priority and deadline
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime();
      }
      
      return 0;
    });

    logger.info(`Task submitted: ${request.id}`, { 
      type: request.type, 
      priority: request.priority 
    }, 'orchestrator');

    return request.id;
  }

  private async startProcessingLoop(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    while (this.isProcessing) {
      try {
        await this.processNextTask();
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      } catch (error) {
        logger.error('Error in processing loop:', error, 'orchestrator');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Longer delay on error
      }
    }
  }

  private async processNextTask(): Promise<void> {
    if (this.taskQueue.length === 0) return;

    const task = this.taskQueue.shift()!;
    const availableAgent = this.findBestAgent(task);

    if (!availableAgent) {
      // No available agent, put task back in queue
      this.taskQueue.unshift(task);
      return;
    }

    try {
      const startTime = Date.now();
      availableAgent.status = 'busy';
      
      const result = await this.executeTask(task, availableAgent);
      const executionTime = Date.now() - startTime;

      // Update agent performance
      this.updateAgentPerformance(availableAgent, executionTime, result.success);
      availableAgent.status = 'idle';

      // Log task completion
      await this.logTaskCompletion(task, availableAgent, result, executionTime);

      this.activeTasks.delete(task.id);

    } catch (error) {
      logger.error(`Task execution failed: ${task.id}`, error, 'orchestrator');
      availableAgent.status = 'idle';
      availableAgent.performance.errorCount++;
    }
  }

  private findBestAgent(task: TaskRequest): AIAgent | null {
    const suitableAgents = Array.from(this.agents.values()).filter(agent => 
      agent.status === 'idle' || agent.status === 'active'
    ).filter(agent => 
      task.requiredCapabilities.every(capability => 
        agent.capabilities.includes(capability)
      )
    );

    if (suitableAgents.length === 0) return null;

    // Score agents based on performance and availability
    return suitableAgents.reduce((best, current) => {
      const bestScore = this.calculateAgentScore(best, task);
      const currentScore = this.calculateAgentScore(current, task);
      return currentScore > bestScore ? current : best;
    });
  }

  private calculateAgentScore(agent: AIAgent, task: TaskRequest): number {
    let score = 0;
    
    // Priority matching
    score += agent.priority * 10;
    
    // Performance metrics
    score += agent.performance.successRate * 50;
    score += Math.max(0, 50 - agent.performance.avgResponseTime / 10);
    score -= agent.performance.errorCount * 5;
    
    // Availability
    if (agent.status === 'idle') score += 20;
    if (agent.status === 'active') score += 10;
    
    // Task priority matching
    const priorityBonus = { critical: 40, high: 30, medium: 20, low: 10 };
    score += priorityBonus[task.priority];

    return score;
  }

  private async executeTask(task: TaskRequest, agent: AIAgent): Promise<TaskResult> {
    const startTime = Date.now();
    
    try {
      let result: any;
      
      switch (agent.type) {
        case 'voice':
          result = await this.executeVoiceTask(task, agent);
          break;
        case 'text':
          result = await this.executeTextTask(task, agent);
          break;
        case 'analytics':
          result = await this.executeAnalyticsTask(task, agent);
          break;
        default:
          throw new Error(`Unknown agent type: ${agent.type}`);
      }

      return {
        taskId: task.id,
        agentId: agent.id,
        success: true,
        result,
        executionTime: Date.now() - startTime,
        confidence: this.calculateConfidence(result, agent)
      };

    } catch (error) {
      return {
        taskId: task.id,
        agentId: agent.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  private async executeVoiceTask(task: TaskRequest, agent: AIAgent): Promise<any> {
    // Simulate voice processing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    switch (task.type) {
      case 'speech-to-text':
        return { transcript: 'Simulated transcript from voice AI' };
      case 'text-to-speech':
        return { audioUrl: 'simulated-audio-url.mp3' };
      case 'sentiment-analysis':
        return { sentiment: 'positive', confidence: 0.85 };
      default:
        throw new Error(`Unsupported voice task: ${task.type}`);
    }
  }

  private async executeTextTask(task: TaskRequest, agent: AIAgent): Promise<any> {
    // Simulate text processing
    await new Promise(resolve => setTimeout(resolve, 150));
    
    switch (task.type) {
      case 'content-generation':
        return { content: 'Generated content based on AI analysis' };
      case 'summarization':
        return { summary: 'AI-generated summary of the content' };
      case 'analysis':
        return { insights: ['Insight 1', 'Insight 2'], confidence: 0.92 };
      default:
        throw new Error(`Unsupported text task: ${task.type}`);
    }
  }

  private async executeAnalyticsTask(task: TaskRequest, agent: AIAgent): Promise<any> {
    // Simulate analytics processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (task.type) {
      case 'data-analysis':
        return { 
          metrics: { conversion: 0.23, engagement: 0.78 },
          trends: ['upward', 'stable'],
          recommendations: ['Increase follow-up frequency', 'Focus on enterprise leads']
        };
      case 'pattern-recognition':
        return { 
          patterns: ['Peak activity at 2PM', 'Higher conversion on Tuesdays'],
          confidence: 0.88
        };
      default:
        throw new Error(`Unsupported analytics task: ${task.type}`);
    }
  }

  private calculateConfidence(result: any, agent: AIAgent): number {
    let confidence = agent.performance.successRate;
    
    if (result.confidence) {
      confidence = (confidence + result.confidence) / 2;
    }
    
    return Math.min(1, Math.max(0, confidence));
  }

  private updateAgentPerformance(agent: AIAgent, executionTime: number, success: boolean): void {
    // Update average response time
    agent.performance.avgResponseTime = 
      (agent.performance.avgResponseTime * 0.9) + (executionTime * 0.1);
    
    // Update success rate
    if (success) {
      agent.performance.successRate = Math.min(1, agent.performance.successRate + 0.01);
    } else {
      agent.performance.successRate = Math.max(0, agent.performance.successRate - 0.05);
      agent.performance.errorCount++;
    }
    
    agent.lastHeartbeat = new Date();
  }

  private async logTaskCompletion(
    task: TaskRequest, 
    agent: AIAgent, 
    result: TaskResult, 
    executionTime: number
  ): Promise<void> {
    try {
      await supabase
        .from('ai_agent_tasks')
        .insert({
          agent_type: agent.type,
          task_type: task.type,
          company_id: task.context.companyId,
          user_id: task.context.userId,
          status: result.success ? 'completed' : 'failed',
          input_payload: task.payload,
          output_payload: result.result,
          error_message: result.error,
          execution_time_ms: executionTime,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        });

      logger.info(`Task completed: ${task.id}`, {
        agentId: agent.id,
        success: result.success,
        executionTime
      }, 'orchestrator');

    } catch (error) {
      logger.error('Failed to log task completion:', error, 'orchestrator');
    }
  }

  private async getUserRole(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.role || 'sales_rep';
    } catch (error) {
      logger.error('Failed to get user role:', error, 'orchestrator');
      return 'sales_rep';
    }
  }

  async getAgentStatus(): Promise<AIAgent[]> {
    return Array.from(this.agents.values());
  }

  async getTaskQueue(): Promise<TaskRequest[]> {
    return [...this.taskQueue];
  }

  async getActiveTasks(): Promise<TaskRequest[]> {
    return Array.from(this.activeTasks.values());
  }

  stop(): void {
    this.isProcessing = false;
    logger.info('AI Orchestrator stopped', {}, 'orchestrator');
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();
