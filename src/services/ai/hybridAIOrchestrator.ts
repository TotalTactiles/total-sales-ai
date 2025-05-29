import { unifiedAIService } from './unifiedAIService';
import { claudeAIService } from './claudeAIService';
import { masterAIBrain } from '../masterAIBrain';
import { dataEncryptionService } from '../security/dataEncryptionService';
import { AuditLoggingService } from '../audit/auditLoggingService';

interface AITask {
  id: string;
  type: 'pattern_analysis' | 'content_summary' | 'conversation' | 'system_insights' | 'market_analysis';
  input: any;
  context: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  companyId: string;
}

interface AIResponse {
  taskId: string;
  result: any;
  source: string;
  executionTime: number;
  confidence: number;
}

export class HybridAIOrchestrator {
  private static instance: HybridAIOrchestrator;
  private taskQueue: AITask[] = [];
  private processingTasks = new Set<string>();

  static getInstance(): HybridAIOrchestrator {
    if (!HybridAIOrchestrator.instance) {
      HybridAIOrchestrator.instance = new HybridAIOrchestrator();
    }
    return HybridAIOrchestrator.instance;
  }

  async processTask(task: AITask): Promise<AIResponse> {
    const startTime = performance.now();
    
    try {
      // Log task initiation using static method
      await AuditLoggingService.logAuditEvent(
        task.userId,
        'user',
        task.companyId,
        'ai_task_initiated',
        'hybrid_ai_orchestrator',
        { taskType: task.type, priority: task.priority },
        'success',
        'medium'
      );

      // Encrypt sensitive data
      const encryptedInput = await dataEncryptionService.encryptSensitiveData(task.input);
      
      let result: any;
      let source: string;

      // Route task to appropriate AI service based on type and complexity
      switch (task.type) {
        case 'pattern_analysis':
        case 'system_insights':
          const insightsResponse = await claudeAIService.generateSystemInsights(
            task.input.userInteractions || [],
            task.input.systemMetrics || []
          );
          result = insightsResponse.response;
          source = insightsResponse.source;
          break;

        case 'content_summary':
          if (task.input.length > 2000) {
            const summaryResponse = await claudeAIService.summarizeLargeContent(
              task.input,
              task.context
            );
            result = summaryResponse.response;
            source = summaryResponse.source;
          } else {
            const quickResponse = await unifiedAIService.performQuickAnalysis(
              `Summarize: ${task.input}`,
              task.context
            );
            result = quickResponse.response;
            source = quickResponse.source;
          }
          break;

        case 'conversation':
          const conversationResponse = await unifiedAIService.generateResponse(
            task.input,
            undefined,
            task.context
          );
          result = conversationResponse.response;
          source = conversationResponse.source;
          break;

        case 'market_analysis':
          const marketResponse = await claudeAIService.contextualizeMarketData(
            task.input.marketData || [],
            task.context
          );
          result = marketResponse.response;
          source = marketResponse.source;
          break;

        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      const executionTime = performance.now() - startTime;
      
      // Store results in Master Brain for learning
      await masterAIBrain.ingestEvent({
        user_id: task.userId,
        company_id: task.companyId,
        event_type: 'ai_output',
        source: 'hybrid_orchestrator',
        data: {
          taskType: task.type,
          source,
          executionTime,
          resultLength: result.length,
          success: true
        },
        context: { 
          originalContext: task.context,
          priority: task.priority
        }
      });

      return {
        taskId: task.id,
        result,
        source,
        executionTime,
        confidence: this.calculateConfidence(task, executionTime)
      };

    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      // Log failure using static method
      await AuditLoggingService.logAuditEvent(
        task.userId,
        'user',
        task.companyId,
        'ai_task_failed',
        'hybrid_ai_orchestrator',
        { 
          taskType: task.type, 
          error: error instanceof Error ? error.message : 'Unknown error',
          executionTime 
        },
        'failure',
        'high'
      );

      throw error;
    }
  }

  private calculateConfidence(task: AITask, executionTime: number): number {
    // Base confidence on task complexity and execution time
    let confidence = 0.8;
    
    if (task.type === 'pattern_analysis' || task.type === 'system_insights') {
      confidence = 0.9; // Claude excels at these
    }
    
    if (executionTime < 2000) {
      confidence += 0.1; // Fast responses are typically more confident
    }
    
    return Math.min(confidence, 1.0);
  }

  async queueTask(task: AITask): Promise<void> {
    this.taskQueue.push(task);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    // Process high priority tasks first
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    while (this.taskQueue.length > 0 && this.processingTasks.size < 3) {
      const task = this.taskQueue.shift();
      if (task && !this.processingTasks.has(task.id)) {
        this.processingTasks.add(task.id);
        
        // Process task asynchronously
        this.processTask(task)
          .finally(() => {
            this.processingTasks.delete(task.id);
          });
      }
    }
  }
}

export const hybridAIOrchestrator = HybridAIOrchestrator.getInstance();
