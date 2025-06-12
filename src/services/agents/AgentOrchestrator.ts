
import { relevanceAIService } from '@/services/relevance/RelevanceAIService';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

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
}

export interface AgentTask {
  agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1';
  taskType: string;
  context: AgentContext;
  priority?: 'low' | 'medium' | 'high';
}

interface AgentResponse {
  success: boolean;
  output: any;
  executionTime: number;
  confidence?: number;
  taskId: string;
}

class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private feedbackHistory: Map<string, any[]> = new Map();
  private performanceMetrics: Map<string, any> = new Map();

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  async executeTask(task: AgentTask): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      // Enhanced context with memory lookup
      const enhancedContext = await this.enrichContext(task.context);
      
      // Execute the task with Relevance AI
      const result = await relevanceAIService.executeTask({
        agentId: task.agentType,
        taskType: task.taskType,
        payload: enhancedContext,
        context: task.context
      });

      // Store in agent memory
      await this.storeInAgentMemory(task, result);

      // Track performance
      const executionTime = Date.now() - startTime;
      this.trackPerformance(task.agentType, task.taskType, executionTime, result.success);

      return {
        success: result.success,
        output: result.output,
        executionTime: result.executionTime,
        confidence: result.output?.confidence || 0.8,
        taskId: result.taskId
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.trackPerformance(task.agentType, task.taskType, executionTime, false);
      
      logger.error('Agent task execution failed:', { 
        task: task.taskType, 
        agent: task.agentType, 
        error 
      });
      
      throw error;
    }
  }

  private async enrichContext(context: AgentContext): Promise<any> {
    const enriched = { ...context };

    try {
      // Add agent memory for this user/lead
      if (context.currentLead?.id) {
        const { data: salesMemory } = await supabase
          .from('SalesAgent_Memory')
          .select('*')
          .eq('lead_id', context.currentLead.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        enriched.salesHistory = salesMemory;
      }

      // Add recent feedback
      enriched.recentFeedback = this.feedbackHistory.get(context.userId) || [];

      // Add performance context for managers
      if (context.userRole === 'manager') {
        const { data: managerMemory } = await supabase
          .from('ManagerAgent_Memory')
          .select('*')
          .eq('rep_id', context.userId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        enriched.managerContext = managerMemory?.[0];
      }

    } catch (error) {
      logger.error('Failed to enrich context:', error);
    }

    return enriched;
  }

  private async storeInAgentMemory(task: AgentTask, result: any): Promise<void> {
    try {
      const { agentType, context } = task;
      
      switch (agentType) {
        case 'salesAgent_v1':
          if (context.currentLead?.id) {
            await supabase
              .from('SalesAgent_Memory')
              .upsert({
                lead_id: context.currentLead.id,
                stage: context.currentLead.status,
                outcome: result.output?.response?.substring(0, 500),
                follow_up_sent: task.taskType === 'follow_up',
                last_contact: new Date().toISOString(),
                notes: `${task.taskType}: ${result.output?.response?.substring(0, 200)}`
              });
          }
          break;

        case 'managerAgent_v1':
          await supabase
            .from('ManagerAgent_Memory')
            .upsert({
              rep_id: context.userId,
              last_login: new Date().toISOString(),
              pipeline_health: 'good',
              task_performance: { [task.taskType]: result.success },
              feedback_log: { [new Date().toISOString()]: result.output?.response }
            });
          break;

        case 'automationAgent_v1':
          await supabase
            .from('AutomationAgent_Memory')
            .insert({
              event_type: task.taskType,
              input_data: context,
              status: result.success ? 'completed' : 'failed',
              resolution_time: result.executionTime
            });
          break;

        case 'developerAgent_v1':
          if (!result.success) {
            await supabase
              .from('DeveloperAgent_Memory')
              .insert({
                agent_affected: task.agentType,
                error_type: task.taskType,
                error_details: result.output?.error || 'Unknown error',
                retry_count: 0,
                escalation_flag: false
              });
          }
          break;
      }
    } catch (error) {
      logger.error('Failed to store agent memory:', error);
    }
  }

  async submitFeedback(
    userId: string, 
    taskId: string, 
    rating: 'positive' | 'negative', 
    correction?: string
  ): Promise<void> {
    const feedback = {
      taskId,
      rating,
      correction,
      timestamp: new Date().toISOString()
    };

    const userFeedback = this.feedbackHistory.get(userId) || [];
    userFeedback.push(feedback);
    this.feedbackHistory.set(userId, userFeedback);

    // Trigger learning if multiple similar corrections
    await this.checkForImprovementTriggers(userId, correction);
  }

  private async checkForImprovementTriggers(userId: string, correction?: string): Promise<void> {
    if (!correction) return;

    const userFeedback = this.feedbackHistory.get(userId) || [];
    const recentCorrections = userFeedback
      .filter(f => f.correction && f.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .map(f => f.correction);

    const correctionCounts = recentCorrections.reduce((acc: Record<string, number>, corr: string) => {
      acc[corr] = (acc[corr] || 0) + 1;
      return acc;
    }, {});

    for (const [corr, count] of Object.entries(correctionCounts)) {
      if (typeof count === 'number' && count >= 3) {
        logger.info('Triggering agent learning for repeated correction:', { userId, correction: corr });
        // Trigger learning via automation agent
        await this.executeTask({
          agentType: 'automationAgent_v1',
          taskType: 'learning_trigger',
          context: {
            workspace: 'learning',
            userId,
            companyId: 'system',
            userRole: 'system',
            correction: corr,
            frequency: count
          }
        });
      }
    }
  }

  private trackPerformance(
    agentType: string, 
    taskType: string, 
    executionTime: number, 
    success: boolean
  ): void {
    const key = `${agentType}-${taskType}`;
    const current = this.performanceMetrics.get(key) || {
      totalExecutions: 0,
      successCount: 0,
      averageTime: 0,
      totalTime: 0
    };

    current.totalExecutions++;
    current.totalTime += executionTime;
    current.averageTime = current.totalTime / current.totalExecutions;
    
    if (success) {
      current.successCount++;
    }

    this.performanceMetrics.set(key, current);
  }

  getPerformanceMetrics(): Map<string, any> {
    return this.performanceMetrics;
  }

  async getAgentHealth(): Promise<any> {
    const relevanceHealth = relevanceAIService.getAgentHealth();
    const performanceData = Array.from(this.performanceMetrics.entries());
    
    return {
      ...relevanceHealth,
      performanceMetrics: performanceData,
      totalTasks: performanceData.reduce((sum, [, metrics]) => sum + metrics.totalExecutions, 0),
      successRate: performanceData.length > 0 
        ? performanceData.reduce((sum, [, metrics]) => sum + (metrics.successCount / metrics.totalExecutions), 0) / performanceData.length
        : 0
    };
  }
}

export const agentOrchestrator = AgentOrchestrator.getInstance();
