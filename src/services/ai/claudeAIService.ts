import { logger } from '@/utils/logger';


import { supabase } from '@/integrations/supabase/client';

export interface ClaudeResponse {
  response: string;
  source: string;
  model: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';
  provider: 'anthropic';
  usage?: {
    tokens: number;
    cost: number;
  };
}

export class ClaudeAIService {
  private static instance: ClaudeAIService;

  static getInstance(): ClaudeAIService {
    if (!ClaudeAIService.instance) {
      ClaudeAIService.instance = new ClaudeAIService();
    }
    return ClaudeAIService.instance;
  }

  async analyzePatterns(data: any[], context: string): Promise<ClaudeResponse> {
    try {
      const { data: response, error } = await supabase.functions.invoke('ai-agent', {
        body: {
          prompt: `Analyze the following data patterns and provide insights: ${JSON.stringify(data)}`,
          systemPrompt: `You are Claude, an expert pattern analyst. Context: ${context}. Provide detailed pattern analysis, insights, and recommendations.`,
          model: 'claude-3-opus',
          provider: 'anthropic'
        }
      });

      if (error) throw error;

      return {
        response: response.response || response.text || 'No analysis generated',
        source: 'claude',
        model: 'claude-3-opus',
        provider: 'anthropic',
        usage: response.usage
      };
    } catch (error) {
      logger.error('Claude pattern analysis failed:', error);
      throw new Error('Claude analysis service unavailable');
    }
  }

  async summarizeLargeContent(content: string, context: string): Promise<ClaudeResponse> {
    try {
      const { data: response, error } = await supabase.functions.invoke('ai-agent', {
        body: {
          prompt: `Summarize this content comprehensively: ${content}`,
          systemPrompt: `You are Claude, an expert at large-scale content summarization. Context: ${context}. Provide a detailed, structured summary with key insights.`,
          model: 'claude-3-opus',
          provider: 'anthropic'
        }
      });

      if (error) throw error;

      return {
        response: response.response || response.text || 'No summary generated',
        source: 'claude',
        model: 'claude-3-opus',
        provider: 'anthropic',
        usage: response.usage
      };
    } catch (error) {
      logger.error('Claude summarization failed:', error);
      throw new Error('Claude summarization service unavailable');
    }
  }

  async generateSystemInsights(userInteractions: any[], systemMetrics: any[]): Promise<ClaudeResponse> {
    try {
      const { data: response, error } = await supabase.functions.invoke('ai-agent', {
        body: {
          prompt: `Generate adaptive system insights based on user interactions: ${JSON.stringify(userInteractions)} and system metrics: ${JSON.stringify(systemMetrics)}`,
          systemPrompt: 'You are Claude, a system intelligence expert. Analyze user behavior patterns, system performance, and suggest proactive improvements for UX, features, and automation flows.',
          model: 'claude-3-opus',
          provider: 'anthropic'
        }
      });

      if (error) throw error;

      return {
        response: response.response || response.text || 'No insights generated',
        source: 'claude',
        model: 'claude-3-opus',
        provider: 'anthropic',
        usage: response.usage
      };
    } catch (error) {
      logger.error('Claude system insights failed:', error);
      throw new Error('Claude insights service unavailable');
    }
  }

  async contextualizeMarketData(marketData: any[], companyContext: string): Promise<ClaudeResponse> {
    try {
      const { data: response, error } = await supabase.functions.invoke('ai-agent', {
        body: {
          prompt: `Contextualize this market data for our company: ${JSON.stringify(marketData)}`,
          systemPrompt: `You are Claude, a market intelligence analyst. Company context: ${companyContext}. Provide strategic insights on how market trends impact this specific business.`,
          model: 'claude-3-opus',
          provider: 'anthropic'
        }
      });

      if (error) throw error;

      return {
        response: response.response || response.text || 'No market analysis generated',
        source: 'claude',
        model: 'claude-3-opus',
        provider: 'anthropic',
        usage: response.usage
      };
    } catch (error) {
      logger.error('Claude market contextualization failed:', error);
      throw new Error('Claude market analysis service unavailable');
    }
  }
}

export const claudeAIService = ClaudeAIService.getInstance();

