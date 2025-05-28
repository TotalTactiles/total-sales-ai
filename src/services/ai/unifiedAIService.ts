
interface AIResponse {
  response: string;
  confidence: number;
  source: 'dummy' | 'openai' | 'claude';
  suggestedActions?: Array<{
    type: string;
    label: string;
    data?: any;
  }>;
}

class UnifiedAIService {
  async generateResponse(
    prompt: string,
    systemMessage?: string,
    context?: string
  ): Promise<AIResponse> {
    // Mock response for demo purposes
    console.log('Generating AI response for:', prompt);
    
    return {
      response: `I understand your request: "${prompt}". This is a demo response from the unified AI service. I'm ready to help with sales tasks, lead management, email drafting, and strategic planning.`,
      confidence: 0.85,
      source: 'dummy',
      suggestedActions: [
        { type: 'follow_up', label: 'Schedule Follow-up' },
        { type: 'draft_email', label: 'Draft Email' }
      ]
    };
  }

  async generateVoiceResponse(text: string): Promise<string> {
    // Return simplified text for voice synthesis
    return text.replace(/\*.*?\*/g, '').replace(/🧪.*$/gm, '').trim();
  }
}

export const unifiedAIService = new UnifiedAIService();
