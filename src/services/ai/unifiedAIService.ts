
import { supabase } from '@/integrations/supabase/client';

export interface AIServiceResponse {
  response: string;
  model: 'gpt-4o' | 'claude-3-opus' | 'claude-3-sonnet';
  provider: 'openai' | 'anthropic';
  usage?: {
    tokens: number;
    cost: number;
  };
}

export class UnifiedAIService {
  private static instance: UnifiedAIService;

  static getInstance(): UnifiedAIService {
    if (!UnifiedAIService.instance) {
      UnifiedAIService.instance = new UnifiedAIService();
    }
    return UnifiedAIService.instance;
  }

  // Determine which AI model is best suited for the task
  private determineOptimalModel(prompt: string, context?: string): 'openai' | 'claude' {
    const promptLower = prompt.toLowerCase();
    const contextLower = context?.toLowerCase() || '';
    
    // Tasks better suited for Claude
    const claudeKeywords = [
      'analyze', 'explain', 'write', 'draft', 'create', 'strategy',
      'training', 'sop', 'documentation', 'policy', 'script',
      'complex reasoning', 'detailed analysis', 'long form',
      'nuanced', 'sophisticated', 'elaborate', 'comprehensive'
    ];

    // Tasks better suited for GPT
    const openaiKeywords = [
      'quick', 'simple', 'fast', 'brief', 'short',
      'json', 'format', 'structure', 'data',
      'calculation', 'math', 'number'
    ];

    const claudeScore = claudeKeywords.reduce((score, keyword) => 
      score + (promptLower.includes(keyword) ? 1 : 0) + (contextLower.includes(keyword) ? 0.5 : 0), 0
    );

    const openaiScore = openaiKeywords.reduce((score, keyword) => 
      score + (promptLower.includes(keyword) ? 1 : 0) + (contextLower.includes(keyword) ? 0.5 : 0), 0
    );

    // If prompt is very long (>500 chars) or complex, prefer Claude
    if (prompt.length > 500 || claudeScore > openaiScore) {
      return 'claude';
    }

    return 'openai';
  }

  async generateResponse(
    prompt: string, 
    systemPrompt?: string,
    context?: string,
    preferredModel?: 'openai' | 'claude'
  ): Promise<AIServiceResponse> {
    const selectedModel = preferredModel || this.determineOptimalModel(prompt, context);
    
    try {
      if (selectedModel === 'claude') {
        return await this.callClaude(prompt, systemPrompt, context);
      } else {
        return await this.callOpenAI(prompt, systemPrompt, context);
      }
    } catch (error) {
      console.error(`Error with ${selectedModel}, attempting fallback:`, error);
      
      // Fallback to the other model
      const fallbackModel = selectedModel === 'claude' ? 'openai' : 'claude';
      
      try {
        if (fallbackModel === 'claude') {
          return await this.callClaude(prompt, systemPrompt, context);
        } else {
          return await this.callOpenAI(prompt, systemPrompt, context);
        }
      } catch (fallbackError) {
        console.error('Both AI services failed:', fallbackError);
        throw new Error('AI services are temporarily unavailable. Please try again later.');
      }
    }
  }

  private async callOpenAI(prompt: string, systemPrompt?: string, context?: string): Promise<AIServiceResponse> {
    const { data, error } = await supabase.functions.invoke('ai-agent', {
      body: {
        prompt: `${context ? `Context: ${context}\n\n` : ''}${prompt}`,
        systemPrompt,
        model: 'gpt-4o',
        provider: 'openai'
      }
    });

    if (error) {
      throw new Error(`OpenAI error: ${error.message}`);
    }

    return {
      response: data.response || data.text || 'No response generated',
      model: 'gpt-4o',
      provider: 'openai',
      usage: data.usage
    };
  }

  private async callClaude(prompt: string, systemPrompt?: string, context?: string): Promise<AIServiceResponse> {
    const { data, error } = await supabase.functions.invoke('ai-agent', {
      body: {
        prompt: `${context ? `Context: ${context}\n\n` : ''}${prompt}`,
        systemPrompt,
        model: 'claude-3-opus',
        provider: 'anthropic'
      }
    });

    if (error) {
      throw new Error(`Claude error: ${error.message}`);
    }

    return {
      response: data.response || data.text || 'No response generated',
      model: 'claude-3-opus',
      provider: 'anthropic',
      usage: data.usage
    };
  }

  // Specialized methods for different use cases
  async generateLongFormContent(prompt: string, context?: string): Promise<AIServiceResponse> {
    return this.generateResponse(prompt, undefined, context, 'claude');
  }

  async performQuickAnalysis(prompt: string, context?: string): Promise<AIServiceResponse> {
    return this.generateResponse(prompt, undefined, context, 'openai');
  }

  async generateStrategy(prompt: string, context?: string): Promise<AIServiceResponse> {
    return this.generateResponse(prompt, 
      'You are a strategic business advisor with deep expertise in sales and business operations.', 
      context, 'claude');
  }

  async draftCommunication(prompt: string, context?: string): Promise<AIServiceResponse> {
    return this.generateResponse(prompt,
      'You are a professional communication expert specializing in business correspondence.',
      context, 'claude');
  }
}

export const unifiedAIService = UnifiedAIService.getInstance();
