

import { dummyResponseService } from './dummyResponseService';
import { validateStringParam } from '@/types/actions';

export interface AIResponse {
  response: string;
  confidence: number;
  suggestedActions?: string[];
  reasoning?: string;
  source: 'dummy' | 'openai' | 'claude';
}

export class UnifiedAIService {
  private static instance: UnifiedAIService;
  private useDummyResponses = true; // Set to true for testing

  static getInstance(): UnifiedAIService {
    if (!UnifiedAIService.instance) {
      UnifiedAIService.instance = new UnifiedAIService();
    }
    return UnifiedAIService.instance;
  }

  setDummyMode(enabled: boolean) {
    this.useDummyResponses = enabled;
    console.log(`AI Service: Dummy mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  async generateResponse(prompt: string, systemPrompt?: string, context?: string): Promise<AIResponse> {
    const validPrompt = validateStringParam(prompt, 'help');
    const validContext = validateStringParam(context, 'general');
    
    try {
      if (this.useDummyResponses) {
        console.log('Using dummy AI response for testing');
        const dummyResponse = dummyResponseService.generateResponse(validPrompt, validContext);
        
        // Simulate processing delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        return {
          ...dummyResponse,
          source: 'dummy'
        };
      }

      // In production, this would call real AI services
      // For now, fallback to dummy responses
      console.log('Real AI services not configured, using dummy responses');
      const dummyResponse = dummyResponseService.generateResponse(validPrompt, validContext);
      
      return {
        ...dummyResponse,
        source: 'dummy'
      };
      
    } catch (error) {
      console.error('AI Service error:', error);
      
      // Fallback to dummy response on error
      const fallbackResponse = dummyResponseService.generateResponse('error occurred', validContext);
      return {
        ...fallbackResponse,
        response: "I encountered an issue processing your request, but I'm still here to help! " + fallbackResponse.response,
        source: 'dummy'
      };
    }
  }

  async performQuickAnalysis(prompt: string, context?: string): Promise<AIResponse> {
    const validPrompt = validateStringParam(prompt, 'analyze data');
    const validContext = validateStringParam(context, 'analysis');
    
    return this.generateResponse(validPrompt, 'You are a quick analysis expert', validContext);
  }

  async generateVoiceResponse(text: string): Promise<string> {
    const validText = validateStringParam(text, 'Hello!');
    
    if (this.useDummyResponses) {
      console.log('Generating dummy voice response');
      return dummyResponseService.generateVoiceResponse(validText);
    }
    
    // Fallback to dummy for testing
    return dummyResponseService.generateVoiceResponse(validText);
  }

  async generateStrategyResponse(prompt: string): Promise<string> {
    const validPrompt = validateStringParam(prompt, 'provide strategy help');
    
    const response = await this.generateResponse(validPrompt, 'You are a sales strategy expert', 'strategy');
    return response.response;
  }

  async generateCommunication(prompt: string): Promise<string> {
    const validPrompt = validateStringParam(prompt, 'help with communication');
    
    const response = await this.generateResponse(validPrompt, 'You are a communication expert', 'communication');
    return response.response;
  }
}

export const unifiedAIService = UnifiedAIService.getInstance();
