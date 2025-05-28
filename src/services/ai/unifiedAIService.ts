
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

  async generateStrategyResponse(prompt: string): Promise<string> {
    console.log('Generating strategy response for:', prompt);
    
    return `Strategic Analysis: ${prompt}. Based on your request, here's my strategic recommendation: Focus on high-value prospects, leverage AI insights for personalized outreach, and maintain consistent follow-up cadence. This is a demo response.`;
  }

  async generateCommunication(prompt: string): Promise<string> {
    console.log('Generating communication for:', prompt);
    
    return `Subject: Follow-up on our conversation\n\nHi [Name],\n\nI hope this email finds you well. Based on our previous discussion about ${prompt}, I wanted to follow up with some additional insights that might be valuable for your business.\n\n[Your personalized message here]\n\nBest regards,\n[Your name]\n\n--- This is a demo email template ---`;
  }

  async generateVoiceResponse(text: string): Promise<string> {
    // Return simplified text for voice synthesis
    return text.replace(/\*.*?\*/g, '').replace(/🧪.*$/gm, '').trim();
  }

  async performQuickAnalysis(data: any): Promise<string> {
    console.log('Performing quick analysis on:', data);
    
    return `Quick Analysis Complete: Based on the provided data, I've identified key patterns and opportunities. This analysis suggests focusing on high-conversion leads and optimizing your current sales approach. Demo analysis result.`;
  }
}

export const unifiedAIService = new UnifiedAIService();
