import { aiConfig } from '@/config/ai';
import { logger } from '@/utils/logger';

export type WorkspaceContext = 'lead_management' | 'academy' | 'dashboard' | 'analytics' | 'general';

export interface AIResponse {
  response: string;
  source: 'openai' | 'claude' | 'relevance' | 'fallback';
  confidence: number;
  suggestedActions?: string[];
  usage?: {
    tokens: number;
    cost?: number;
  };
}

class UnifiedAIService {
  private fallbackCount = 0;
  private readonly maxFallbacks = 3;

  async generateResponse(
    prompt: string,
    systemMessage?: string,
    context?: string,
    preferredProvider?: 'openai' | 'claude',
    category?: string
  ): Promise<AIResponse> {
    try {
      // Determine which AI provider to use
      const provider = preferredProvider || this.selectProvider(prompt, category);
      
      logger.info('Generating AI response', { provider, category, promptLength: prompt.length });

      let response: AIResponse;

      switch (provider) {
        case 'openai':
          response = await this.callOpenAI(prompt, systemMessage, context);
          break;
        case 'claude':
          response = await this.callClaude(prompt, systemMessage, context);
          break;
        default:
          response = this.getFallbackResponse(category);
      }

      // Reset fallback counter on success
      this.fallbackCount = 0;
      
      return response;

    } catch (error) {
      logger.error('AI response generation failed', error);
      return this.handleError(prompt, category);
    }
  }

  async generateVoiceResponse(text: string): Promise<string> {
    // Simplify text for voice synthesis
    return text.replace(/[*#`]/g, '').substring(0, 200);
  }

  async generateStrategyResponse(prompt: string): Promise<string> {
    const response = await this.generateResponse(
      prompt,
      'You are a strategic business advisor. Provide clear, actionable insights and recommendations.',
      undefined,
      'claude',
      'strategy'
    );
    return response.response;
  }

  async generateCommunication(prompt: string): Promise<string> {
    const response = await this.generateResponse(
      prompt,
      'You are a professional communication assistant. Write clear, engaging, and appropriate messages.',
      undefined,
      'openai',
      'communication'
    );
    return response.response;
  }

  async performQuickAnalysis(data: any): Promise<string> {
    const prompt = `Perform a quick analysis of the following data: ${JSON.stringify(data)}`;
    const response = await this.generateResponse(
      prompt,
      'You are a data analyst. Provide quick, actionable insights.',
      undefined,
      'openai',
      'analysis'
    );
    return response.response;
  }

  private selectProvider(prompt: string, category?: string): 'openai' | 'claude' {
    // Route based on category and prompt characteristics
    if (category === 'strategy' || category === 'analysis') {
      return 'claude';
    }
    
    if (category === 'communication' || category === 'email') {
      return 'openai';
    }

    // Default routing based on prompt length
    return prompt.length > 1000 ? 'claude' : 'openai';
  }

  private async callOpenAI(prompt: string, systemMessage?: string, context?: string): Promise<AIResponse> {
    const messages = [];
    
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }
    
    if (context) {
      messages.push({ role: 'system', content: `Context: ${context}` });
    }
    
    messages.push({ role: 'user', content: prompt });

    // In a real implementation, this would call the OpenAI API
    // For now, we'll simulate a response
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      response: this.generateMockResponse(prompt, 'openai'),
      source: 'openai',
      confidence: 0.85,
      suggestedActions: this.generateSuggestedActions(prompt),
      usage: { tokens: 150 }
    };
  }

  private async callClaude(prompt: string, systemMessage?: string, context?: string): Promise<AIResponse> {
    const fullPrompt = [
      systemMessage && `System: ${systemMessage}`,
      context && `Context: ${context}`,
      `Human: ${prompt}`,
      'Assistant:'
    ].filter(Boolean).join('\n\n');

    // In a real implementation, this would call the Claude API
    // For now, we'll simulate a response
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      response: this.generateMockResponse(prompt, 'claude'),
      source: 'claude',
      confidence: 0.90,
      suggestedActions: this.generateSuggestedActions(prompt),
      usage: { tokens: 200 }
    };
  }

  private generateSuggestedActions(prompt: string): string[] {
    const actions = [];
    
    if (prompt.toLowerCase().includes('lead')) {
      actions.push('Analyze lead score', 'Schedule follow-up', 'Send personalized email');
    }
    
    if (prompt.toLowerCase().includes('call')) {
      actions.push('Prepare talking points', 'Set reminder', 'Review call history');
    }
    
    if (prompt.toLowerCase().includes('team')) {
      actions.push('Review performance', 'Schedule meeting', 'Create action plan');
    }
    
    return actions.slice(0, 3);
  }

  private generateMockResponse(prompt: string, source: 'openai' | 'claude'): string {
    // Generate contextual mock responses based on prompt content
    if (prompt.toLowerCase().includes('lead') || prompt.toLowerCase().includes('prospect')) {
      return `Based on the lead information provided, I recommend focusing on their pain points and demonstrating clear value. Here's a personalized approach: [Detailed analysis and recommendations...]`;
    }
    
    if (prompt.toLowerCase().includes('call') || prompt.toLowerCase().includes('phone')) {
      return `For your upcoming call, here are some key talking points and strategies: [Call preparation advice...]`;
    }
    
    if (prompt.toLowerCase().includes('email') || prompt.toLowerCase().includes('message')) {
      return `Here's a well-crafted message for your situation: [Professional email template...]`;
    }
    
    if (prompt.toLowerCase().includes('team') || prompt.toLowerCase().includes('performance')) {
      return `Based on your team's performance data, here are actionable insights: [Management recommendations...]`;
    }

    return `I understand you're looking for assistance with: "${prompt.substring(0, 50)}...". Here's my recommendation: [Contextual AI response based on your specific situation and role.]`;
  }

  private getFallbackResponse(category?: string): AIResponse {
    let response = aiConfig.fallback.responses.generic;
    
    if (category === 'sales' || category === 'lead_management') {
      response = aiConfig.fallback.responses.sales;
    } else if (category === 'management' || category === 'strategy') {
      response = aiConfig.fallback.responses.manager;
    }

    return {
      response,
      source: 'fallback',
      confidence: 0.5,
      suggestedActions: ['Try again', 'Contact support', 'Check connection']
    };
  }

  private handleError(prompt: string, category?: string): AIResponse {
    this.fallbackCount++;
    
    if (this.fallbackCount >= this.maxFallbacks) {
      return {
        response: "I'm experiencing technical difficulties. Please try again in a moment, or contact support if the issue persists.",
        source: 'fallback',
        confidence: 0.3,
        suggestedActions: ['Retry', 'Contact support']
      };
    }

    return this.getFallbackResponse(category);
  }
}

export const unifiedAIService = new UnifiedAIService();
