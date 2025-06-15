
import { relevanceAIAgent } from '@/services/relevance/RelevanceAIAgentService';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

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
  
  // Extended context for enhanced functionality
  teamComparison?: any;
  industryBenchmarks?: any;
  performanceHistory?: any;
  similarLeadOutcomes?: any;
  recentFeedback?: any[];
  
  // Task-specific context
  query?: string;
  isCallActive?: boolean;
  leadId?: string;
  scenario?: string;
  objection?: string;
}

export interface AgentTask {
  agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1';
  taskType: string;
  context: AgentContext;
  priority?: 'low' | 'medium' | 'high';
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

  async executeTask(task: AgentTask): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Enhanced context with multi-layered awareness
      const enhancedContext = await this.enrichContext(task.context);
      
      // Execute the task with the appropriate agent
      const result = await relevanceAIAgent.executeAgentTask(
        task.agentType,
        task.taskType,
        enhancedContext,
        task.context.userId,
        task.context.companyId
      );

      // Track performance metrics
      const executionTime = Date.now() - startTime;
      this.trackPerformance(task.agentType, task.taskType, executionTime, true);

      // Apply tone adaptation if specified
      if (task.context.tone && result.output_payload?.response) {
        result.output_payload.response = await this.adaptTone(
          result.output_payload.response,
          task.context.tone
        );
      }

      return result;

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

    // Add team comparison data for strategic recommendations
    if (context.userRole === 'manager') {
      enriched.teamComparison = await this.getTeamComparisonData(context.companyId);
      enriched.industryBenchmarks = await this.getIndustryBenchmarks(context.industry);
    }

    // Add rep performance history for sales agents
    if (context.userRole === 'sales_rep') {
      enriched.performanceHistory = await this.getUserPerformanceHistory(context.userId);
      enriched.similarLeadOutcomes = await this.getSimilarLeadOutcomes(context.currentLead);
    }

    // Add recent feedback for self-improvement
    enriched.recentFeedback = this.feedbackHistory.get(context.userId) || [];

    return enriched;
  }

  private async adaptTone(content: string, tone: string): Promise<string> {
    // Tone adaptation logic - could be enhanced with AI
    const toneMap = {
      'formal': content,
      'friendly': content.replace(/\./g, '!').replace(/However,/g, 'But hey,'),
      'direct': content.replace(/I think|I believe|Perhaps/g, '').replace(/might/g, 'will'),
      'aggressive': content.replace(/please/gi, '').replace(/thank you/gi, 'NOW').toUpperCase()
    };

    return toneMap[tone as keyof typeof toneMap] || content;
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

    // Trigger self-improvement if multiple similar corrections
    await this.checkForImprovementTriggers(userId, correction);
  }

  private async checkForImprovementTriggers(userId: string, correction?: string): Promise<void> {
    if (!correction) return;

    const userFeedback = this.feedbackHistory.get(userId) || [];
    const recentCorrections = userFeedback
      .filter(f => f.correction && f.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .map(f => f.correction);

    // If similar corrections appear 3+ times, trigger learning
    const correctionCounts = recentCorrections.reduce((acc: Record<string, number>, corr: string) => {
      acc[corr] = (acc[corr] || 0) + 1;
      return acc;
    }, {});

    for (const [corr, count] of Object.entries(correctionCounts)) {
      if (typeof count === 'number' && count >= 3) {
        logger.info('Triggering agent learning for repeated correction:', { userId, correction: corr });
        // Here you would implement the learning signal back to the system
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

  private async getTeamComparisonData(companyId: string): Promise<any> {
    // Mock implementation - would fetch real team data
    return {
      teamSize: 5,
      avgCallsPerDay: 45,
      avgConversionRate: 0.23,
      topPerformer: { name: 'Sarah', rate: 0.35 }
    };
  }

  private async getIndustryBenchmarks(industry?: string): Promise<any> {
    // Mock implementation - would fetch industry data
    return {
      avgResponseTime: '2.3 hours',
      conversionRate: 0.18,
      avgDealSize: '$15,400'
    };
  }

  private async getUserPerformanceHistory(userId: string): Promise<any> {
    // Mock implementation - would fetch user performance
    return {
      last30Days: { calls: 150, wins: 12, winRate: 0.08 },
      trending: 'up',
      bestCallTime: '10:30 AM'
    };
  }

  private async getSimilarLeadOutcomes(lead?: any): Promise<any> {
    if (!lead) return {};
    
    // Mock implementation - would analyze similar leads
    return {
      similarCompanyOutcomes: 0.45,
      industryPattern: 'responds well to ROI focus',
      recommendedApproach: 'technical demo first'
    };
  }
}

export const agentOrchestrator = AgentOrchestrator.getInstance();
