
import { logger } from '@/utils/logger';

export interface AIQuery {
  assistantType: 'dashboard' | 'business-ops' | 'team' | 'leads' | 'company-brain';
  query: string;
  context: any;
  userId?: string;
  companyId?: string;
}

export interface AIResponse {
  success: boolean;
  response: string;
  insights?: any;
  chartData?: {
    type: 'line' | 'bar' | 'pie' | 'table' | 'scorecard';
    data: any;
    config?: any;
  };
  actions?: string[];
  whispers?: {
    targetRepId: string;
    message: string;
    context: any;
  }[];
  error?: string;
}

export class AIProcessor {
  private static instance: AIProcessor;
  private openAIKey: string | null = null;
  private anthropicKey: string | null = null;

  private constructor() {
    // Initialize with environment variables if available
    this.openAIKey = process.env.OPENAI_API_KEY || null;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY || null;
  }

  static getInstance(): AIProcessor {
    if (!AIProcessor.instance) {
      AIProcessor.instance = new AIProcessor();
    }
    return AIProcessor.instance;
  }

  async processQuery(query: AIQuery): Promise<AIResponse> {
    try {
      logger.info('Processing AI query', { assistantType: query.assistantType }, 'ai-processor');

      // Route based on query complexity and type
      const useGPT4 = this.shouldUseGPT4(query);
      
      if (useGPT4 && this.openAIKey) {
        return await this.processWithOpenAI(query);
      } else if (this.anthropicKey) {
        return await this.processWithAnthropic(query);
      } else {
        return this.generateMockResponse(query);
      }
    } catch (error) {
      logger.error('AI processing failed', error, 'ai-processor');
      return {
        success: false,
        response: 'I apologize, but I encountered an error processing your request. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private shouldUseGPT4(query: AIQuery): boolean {
    // Use GPT-4 for complex analysis, charts, or data processing
    const complexKeywords = ['analyze', 'chart', 'graph', 'predict', 'compare', 'calculate'];
    return complexKeywords.some(keyword => 
      query.query.toLowerCase().includes(keyword)
    );
  }

  private async processWithOpenAI(query: AIQuery): Promise<AIResponse> {
    const systemPrompt = this.getSystemPrompt(query.assistantType);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: this.formatQuery(query) }
        ],
        functions: this.getFunctionDefinitions(query.assistantType),
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    return this.parseOpenAIResponse(data, query);
  }

  private async processWithAnthropic(query: AIQuery): Promise<AIResponse> {
    const systemPrompt = this.getSystemPrompt(query.assistantType);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.anthropicKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: this.formatQuery(query) }
        ]
      }),
    });

    const data = await response.json();
    return this.parseAnthropicResponse(data, query);
  }

  private getSystemPrompt(assistantType: string): string {
    const prompts = {
      dashboard: 'You are the CEO EA AI assistant. You provide executive summaries, alerts, and pulse checks. Always be concise and actionable.',
      'business-ops': 'You are the Business Operations AI. You analyze KPIs, create projections, and run scenario simulations. Focus on metrics and data-driven insights.',
      team: 'You are the Team AI assistant. You analyze team performance, suggest rewards, and provide coaching insights. Be motivational and data-driven.',
      leads: 'You are the Leads AI assistant. You analyze lead data, provide scoring predictions, and suggest reassignments. Focus on conversion optimization.',
      'company-brain': 'You are the Company Brain AI. You orchestrate data across all systems and provide comprehensive insights to other AI assistants.'
    };
    
    return prompts[assistantType as keyof typeof prompts] || 'You are a helpful AI assistant.';
  }

  private formatQuery(query: AIQuery): string {
    return `Query: ${query.query}\n\nContext: ${JSON.stringify(query.context, null, 2)}`;
  }

  private getFunctionDefinitions(assistantType: string) {
    const baseFunctions = [
      {
        name: 'generate_chart',
        description: 'Generate chart data for visualization',
        parameters: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['line', 'bar', 'pie', 'table', 'scorecard'] },
            data: { type: 'object' },
            title: { type: 'string' }
          }
        }
      },
      {
        name: 'send_whisper',
        description: 'Send a whisper message to another rep or AI',
        parameters: {
          type: 'object',
          properties: {
            targetRepId: { type: 'string' },
            message: { type: 'string' },
            context: { type: 'object' }
          }
        }
      }
    ];

    return baseFunctions;
  }

  private parseOpenAIResponse(data: any, query: AIQuery): AIResponse {
    if (data.error) {
      throw new Error(data.error.message);
    }

    const message = data.choices[0].message;
    let response: AIResponse = {
      success: true,
      response: message.content || 'I understand your request.'
    };

    // Handle function calls
    if (message.function_call) {
      const functionName = message.function_call.name;
      const args = JSON.parse(message.function_call.arguments);

      if (functionName === 'generate_chart') {
        response.chartData = {
          type: args.type,
          data: args.data,
          config: { title: args.title }
        };
      } else if (functionName === 'send_whisper') {
        response.whispers = [{
          targetRepId: args.targetRepId,
          message: args.message,
          context: args.context
        }];
      }
    }

    return response;
  }

  private parseAnthropicResponse(data: any, query: AIQuery): AIResponse {
    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      response: data.content[0].text || 'I understand your request.'
    };
  }

  private generateMockResponse(query: AIQuery): AIResponse {
    const mockResponses = {
      dashboard: 'Dashboard overview: All systems running smoothly. 3 alerts require attention.',
      'business-ops': 'KPI Analysis: Revenue up 12% this quarter. Conversion rate steady at 3.2%.',
      team: 'Team Performance: Overall productivity up 8%. Sarah leads in conversions this week.',
      leads: 'Lead Analysis: 24 new leads this week. 67% match your ideal customer profile.',
      'company-brain': 'Data orchestration complete. All AI systems have access to latest insights.'
    };

    return {
      success: true,
      response: mockResponses[query.assistantType] || 'I understand your request and am processing it.',
      insights: {
        mockData: true,
        timestamp: new Date().toISOString()
      }
    };
  }
}
