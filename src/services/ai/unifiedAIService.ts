
// Unified AI Service for Total Tactiles OS
import { supabase } from '@/integrations/supabase/client';
import { withRetry } from '@/utils/withRetry';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export interface AIResponse {
  response: string;
  confidence: number;
  context?: string;
  suggestions?: string[];
  source?: 'chatgpt' | 'claude' | 'mock';
  suggestedActions?: string[];
}

export type AIProvider = 'claude' | 'openai' | 'local';
export type WorkspaceContext = 'lead_management' | 'academy' | 'dashboard' | 'analytics' | 'general';

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
    provider: AIProvider = 'openai',
    workspaceContext?: WorkspaceContext
  ): Promise<AIResponse> {
    try {
      // Try ChatGPT first
      if (provider === 'openai') {
        try {
          const chatGptResponse = await this.callChatGPT(prompt, systemMessage, workspaceContext);
          if (chatGptResponse) return chatGptResponse;
        } catch (error) {
          logger.warn('ChatGPT failed, falling back to Claude', error, 'ai_brain');
        }
      }

      // Try Claude as fallback or primary
      if (provider === 'claude' || provider === 'openai') {
        try {
          const claudeResponse = await this.callClaude(prompt, systemMessage, workspaceContext);
          if (claudeResponse) return claudeResponse;
        } catch (error) {
          logger.warn('Claude failed, using mock response', error, 'ai_brain');
        }
      }

      // Fallback to mock response
      return this.getMockResponse(prompt, context, workspaceContext);
    } catch (error) {
      logger.error('Failed to generate AI response', error, 'ai_brain');
      throw error;
    }
  }

  private async callChatGPT(prompt: string, systemMessage?: string, workspaceContext?: WorkspaceContext): Promise<AIResponse | null> {
    try {
      const contextualSystemMessage = this.getContextualSystemMessage(systemMessage, workspaceContext);
      
      const { data, error } = await withRetry(
        () =>
          supabase.functions.invoke('openai-chat', {
            body: {
              prompt,
              systemMessage: contextualSystemMessage,
              context: workspaceContext
            }
          }),
        'openai-chat'
      );

      if (error) throw error;

      return {
        response: data.response,
        confidence: 0.9,
        context: workspaceContext,
        source: 'chatgpt',
        suggestions: data.suggestions || [],
        suggestedActions: data.suggestedActions || []
      };
    } catch (error) {
      logger.error('ChatGPT API call failed', error, 'ai_brain');
      return null;
    }
  }

  private async callClaude(prompt: string, systemMessage?: string, workspaceContext?: WorkspaceContext): Promise<AIResponse | null> {
    try {
      const contextualSystemMessage = this.getContextualSystemMessage(systemMessage, workspaceContext);
      
      const { data, error } = await withRetry(
        () =>
          supabase.functions.invoke('claude-chat', {
            body: {
              prompt,
              systemMessage: contextualSystemMessage,
              context: workspaceContext
            }
          }),
        'claude-chat'
      );

      if (error) throw error;

      return {
        response: data.response,
        confidence: 0.85,
        context: workspaceContext,
        source: 'claude',
        suggestions: data.suggestions || [],
        suggestedActions: data.suggestedActions || []
      };
    } catch (error) {
      logger.error('Claude API call failed', error, 'ai_brain');
      return null;
    }
  }

  private getContextualSystemMessage(baseMessage?: string, workspaceContext?: WorkspaceContext): string {
    const basePrompt = baseMessage || 'You are a helpful AI assistant for Total Tactiles OS.';
    
    const contextPrompts = {
      lead_management: 'You are specialized in lead management, sales strategies, and CRM operations. Focus on actionable sales advice.',
      academy: 'You are a training and education specialist. Provide learning content, skill development, and coaching insights.',
      dashboard: 'You are a performance analyst. Focus on metrics, KPIs, and business intelligence insights.',
      analytics: 'You are a data analyst. Provide deep insights, trends analysis, and predictive recommendations.',
      general: 'You are a general business assistant for sales and management operations.'
    };

    const contextPrompt = contextPrompts[workspaceContext || 'general'];
    return `${basePrompt} ${contextPrompt}`;
  }

  private getMockResponse(prompt: string, context?: string, workspaceContext?: WorkspaceContext): AIResponse {
    const workspaceResponses = {
      lead_management: `Based on your lead management query: "${prompt.substring(0, 50)}...", I recommend focusing on lead scoring and follow-up timing. Consider implementing automated nurture sequences.`,
      academy: `For your training inquiry: "${prompt.substring(0, 50)}...", I suggest starting with foundational sales methodology courses and role-playing exercises.`,
      dashboard: `Regarding your performance question: "${prompt.substring(0, 50)}...", your current metrics show strong potential. Focus on conversion rate optimization.`,
      analytics: `For your analytics request: "${prompt.substring(0, 50)}...", the data suggests seasonal trends. Consider implementing predictive modeling.`,
      general: `I understand you're asking about: "${prompt.substring(0, 50)}...". Let me provide you with relevant insights and recommendations.`
    };

    const response = workspaceResponses[workspaceContext || 'general'];

    return {
      response,
      confidence: 0.75,
      context: workspaceContext || context || 'general',
      source: 'mock',
      suggestions: [
        'Would you like more specific recommendations?',
        'Should I analyze this further?',
        'Do you need implementation steps?'
      ],
      suggestedActions: [
        'Get detailed analysis',
        'Create action plan',
        'Schedule follow-up'
      ]
    };
  }

  async generateStrategyResponse(prompt: string, workspaceContext?: WorkspaceContext): Promise<string> {
    const response = await this.generateResponse(
      prompt,
      'You are a strategic business advisor. Provide comprehensive, actionable strategies.',
      'strategy',
      'claude',
      workspaceContext
    );
    return response.response;
  }

  async generateCommunication(prompt: string, workspaceContext?: WorkspaceContext): Promise<string> {
    const response = await this.generateResponse(
      prompt,
      'You are a professional communication expert. Help draft clear, effective business communications.',
      'communication',
      'openai',
      workspaceContext
    );
    return response.response;
  }

  async generateVoiceResponse(text: string): Promise<string> {
    // Optimize text for voice synthesis
    return text
      .replace(/[^\w\s.,!?]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500); // Limit for voice
  }

  async performQuickAnalysis(data: any, analysisType: string): Promise<AIResponse> {
    const prompt = `Quickly analyze this ${analysisType} data: ${JSON.stringify(data).substring(0, 200)}...`;
    return await this.generateResponse(prompt, 'You are a quick data analyst. Provide concise insights.', analysisType);
  }

  async analyzeData(data: any, analysisType: string): Promise<AIResponse> {
    try {
      const prompt = `Analyze this ${analysisType} data: ${JSON.stringify(data)}`;
      return await this.generateResponse(prompt, 'You are a data analysis expert.', analysisType);
    } catch (error) {
      logger.error('Failed to analyze data', error, 'ai_brain');
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
      logger.error('Failed to generate suggestions', error, 'ai_brain');
      return [];
    }
  }
}

export const unifiedAIService = UnifiedAIService.getInstance();
