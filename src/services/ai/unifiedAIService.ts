
// Unified AI Service for Total Tactiles OS
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export interface AIResponse {
  response: string;
  confidence: number;
  context?: string;
  suggestions?: string[];
}

export type AIProvider = 'claude' | 'openai' | 'local';

export class UnifiedAIService {
  private static instance: UnifiedAIService;
  
  static getInstance(): UnifiedAIService {
    if (!UnifiedAIService.instance) {
      UnifiedAIService.instance = new UnifiedAIService();
    }
    return UnifiedAIService.instance;
  }

  async generateResponse(
    prompt: string, 
    systemMessage?: string, 
    context?: string,
    provider: AIProvider = 'openai'
  ): Promise<AIResponse> {
    try {
      // For now, return a mock response since we need to implement the actual AI service
      const mockResponse: AIResponse = {
        response: `AI Analysis: ${prompt.substring(0, 100)}... [This is a mock response]`,
        confidence: 0.85,
        context: context || 'general',
        suggestions: [
          'Consider following up with the lead',
          'Review the data for accuracy',
          'Schedule a demo call'
        ]
      };

      logger.info('AI response generated', { prompt: prompt.substring(0, 50), provider }, 'automation');
      
      return mockResponse;
    } catch (error) {
      logger.error('Failed to generate AI response', error, 'automation');
      throw error;
    }
  }

  async analyzeData(data: any, analysisType: string): Promise<AIResponse> {
    try {
      const prompt = `Analyze this ${analysisType} data: ${JSON.stringify(data)}`;
      return await this.generateResponse(prompt, 'You are a data analysis expert.', analysisType);
    } catch (error) {
      logger.error('Failed to analyze data', error, 'automation');
      throw error;
    }
  }

  async generateSuggestions(context: string, userRole: string): Promise<string[]> {
    try {
      const response = await this.generateResponse(
        `Generate suggestions for ${userRole} in context: ${context}`,
        `You are an AI assistant helping a ${userRole}.`,
        context
      );
      
      return response.suggestions || [];
    } catch (error) {
      logger.error('Failed to generate suggestions', error, 'automation');
      return [];
    }
  }
}

export const unifiedAIService = UnifiedAIService.getInstance();
