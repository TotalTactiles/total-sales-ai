
// Central AI Orchestration System
import { AI_CONFIG, isAIEnabled } from '../config/AIConfig';
import { logger } from '@/utils/logger';

export interface AIRequest {
  id: string;
  type: string;
  payload: any;
  context: {
    workspace: string;
    userId: string;
    companyId: string;
    timestamp: string;
  };
}

export interface AIResponse {
  id: string;
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

export class AIOrchestrator {
  private static instance: AIOrchestrator;

  static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  async executeRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = performance.now();
    
    try {
      // Check if AI is globally enabled
      if (!isAIEnabled()) {
        return this.createDisabledResponse(request.id, startTime);
      }

      // Route to appropriate handler based on request type
      const handler = this.getHandlerForType(request.type);
      if (!handler) {
        throw new Error(`No handler found for AI request type: ${request.type}`);
      }

      const result = await handler(request);
      
      const executionTime = performance.now() - startTime;
      logger.info('AI request executed successfully', {
        requestId: request.id,
        type: request.type,
        executionTime
      });

      return {
        id: request.id,
        success: true,
        data: result,
        executionTime
      };

    } catch (error) {
      const executionTime = performance.now() - startTime;
      logger.error('AI request failed', {
        requestId: request.id,
        type: request.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime
      });

      return {
        id: request.id,
        success: false,
        error: error instanceof Error ? error.message : 'AI request failed',
        executionTime
      };
    }
  }

  private createDisabledResponse(requestId: string, startTime: number): AIResponse {
    return {
      id: requestId,
      success: false,
      error: 'AI functionality temporarily disabled',
      executionTime: performance.now() - startTime
    };
  }

  private getHandlerForType(type: string): ((request: AIRequest) => Promise<any>) | null {
    // Handler mapping - will be populated when AI is re-enabled
    const handlers: Record<string, (request: AIRequest) => Promise<any>> = {};
    
    return handlers[type] || null;
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();
