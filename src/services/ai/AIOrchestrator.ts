
import { logger } from '@/utils/logger';
import { masterAIBrain } from '@/services/masterAIBrain';
import { supabase } from '@/integrations/supabase/client';

export interface AIModelConfig {
  provider: 'openai' | 'claude' | 'relevance';
  model: string;
  capabilities: string[];
  costPerToken: number;
  maxTokens: number;
  isActive: boolean;
}

export interface AIRequest {
  userId: string;
  companyId: string;
  workspace: 'sales' | 'manager' | 'developer';
  agentType: string;
  inputType: 'chat' | 'automation' | 'analysis';
  prompt: string;
  context?: any;
  preferredModel?: string;
}

export interface AIResponse {
  id: string;
  response: string;
  model: string;
  provider: string;
  tokensUsed: number;
  processingTime: number;
  confidence: number;
  suggestedActions?: string[];
}

class AIOrchestrator {
  private static instance: AIOrchestrator;
  private models: Map<string, AIModelConfig> = new Map();
  private isLive: boolean = false;

  static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    // OpenAI Models
    this.registerModel('gpt-4o-mini', {
      provider: 'openai',
      model: 'gpt-4o-mini',
      capabilities: ['chat', 'analysis', 'code_generation', 'email_drafting'],
      costPerToken: 0.00015,
      maxTokens: 16000,
      isActive: false
    });

    this.registerModel('gpt-4o', {
      provider: 'openai', 
      model: 'gpt-4o',
      capabilities: ['chat', 'analysis', 'complex_reasoning', 'strategic_planning'],
      costPerToken: 0.005,
      maxTokens: 32000,
      isActive: false
    });

    // Claude Models
    this.registerModel('claude-3-haiku', {
      provider: 'claude',
      model: 'claude-3-haiku-20240307',
      capabilities: ['chat', 'analysis', 'fast_processing'],
      costPerToken: 0.00025,
      maxTokens: 200000,
      isActive: false
    });

    this.registerModel('claude-3-opus', {
      provider: 'claude',
      model: 'claude-3-opus-20240229', 
      capabilities: ['complex_analysis', 'strategic_thinking', 'detailed_reasoning'],
      costPerToken: 0.015,
      maxTokens: 200000,
      isActive: false
    });

    // Relevance AI Agents
    this.registerModel('relevance-sales', {
      provider: 'relevance',
      model: 'salesAgent_v1',
      capabilities: ['lead_analysis', 'email_automation', 'crm_integration'],
      costPerToken: 0.001,
      maxTokens: 8000,
      isActive: false
    });

    this.registerModel('relevance-manager', {
      provider: 'relevance',
      model: 'managerAgent_v1', 
      capabilities: ['team_analytics', 'performance_tracking', 'report_generation'],
      costPerToken: 0.001,
      maxTokens: 8000,
      isActive: false
    });

    this.registerModel('relevance-developer', {
      provider: 'relevance',
      model: 'developerAgent_v1',
      capabilities: ['system_monitoring', 'error_analysis', 'optimization'],
      costPerToken: 0.001,
      maxTokens: 8000,
      isActive: false
    });
  }

  registerModel(id: string, config: AIModelConfig) {
    this.models.set(id, config);
    logger.info('AI Model registered:', { id, provider: config.provider, model: config.model });
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
      // Log the request
      await this.logRequest(requestId, request);

      // Select appropriate model
      const model = this.selectModel(request);
      
      if (!this.isLive) {
        // Return simulation response during pre-live phase
        return this.generateSimulationResponse(requestId, request, model, startTime);
      }

      // When live, route to actual AI processing
      const response = await this.routeToModel(model, request);
      
      // Log the response
      await this.logResponse(requestId, response);

      return response;

    } catch (error) {
      logger.error('AI request processing failed:', error);
      
      // Log the error
      await this.logError(requestId, request, error as Error);
      
      throw error;
    }
  }

  private selectModel(request: AIRequest): AIModelConfig {
    // Model selection logic based on workspace and task type
    const workspaceModels = {
      sales: {
        chat: 'gpt-4o-mini',
        automation: 'relevance-sales',
        analysis: 'claude-3-haiku'
      },
      manager: {
        chat: 'gpt-4o',
        automation: 'relevance-manager', 
        analysis: 'claude-3-opus'
      },
      developer: {
        chat: 'gpt-4o-mini',
        automation: 'relevance-developer',
        analysis: 'claude-3-haiku'
      }
    };

    const modelId = request.preferredModel || 
                   workspaceModels[request.workspace]?.[request.inputType] || 
                   'gpt-4o-mini';

    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    return model;
  }

  private async routeToModel(model: AIModelConfig, request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    switch (model.provider) {
      case 'openai':
        return await this.callOpenAI(model, request, startTime);
      case 'claude':
        return await this.callClaude(model, request, startTime);
      case 'relevance':
        return await this.callRelevanceAI(model, request, startTime);
      default:
        throw new Error(`Unsupported provider: ${model.provider}`);
    }
  }

  private async callOpenAI(model: AIModelConfig, request: AIRequest, startTime: number): Promise<AIResponse> {
    // This will be implemented when going live
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        model: model.model,
        messages: [
          { role: 'system', content: this.getSystemPrompt(request.workspace, request.agentType) },
          { role: 'user', content: request.prompt }
        ],
        user_id: request.userId,
        company_id: request.companyId
      }
    });

    if (error) throw error;

    return {
      id: crypto.randomUUID(),
      response: data.response,
      model: model.model,
      provider: 'openai',
      tokensUsed: data.usage?.total_tokens || 0,
      processingTime: Date.now() - startTime,
      confidence: 0.85,
      suggestedActions: data.suggested_actions || []
    };
  }

  private async callClaude(model: AIModelConfig, request: AIRequest, startTime: number): Promise<AIResponse> {
    // This will be implemented when going live
    const { data, error } = await supabase.functions.invoke('claude-chat', {
      body: {
        model: model.model,
        prompt: `${this.getSystemPrompt(request.workspace, request.agentType)}\n\nHuman: ${request.prompt}\n\nAssistant:`,
        user_id: request.userId,
        company_id: request.companyId
      }
    });

    if (error) throw error;

    return {
      id: crypto.randomUUID(),
      response: data.response,
      model: model.model,
      provider: 'claude',
      tokensUsed: data.usage?.total_tokens || 0,
      processingTime: Date.now() - startTime,
      confidence: 0.90,
      suggestedActions: []
    };
  }

  private async callRelevanceAI(model: AIModelConfig, request: AIRequest, startTime: number): Promise<AIResponse> {
    // This will be implemented when going live
    const { data, error } = await supabase.functions.invoke('relevance-ai', {
      body: {
        agent_type: model.model,
        task_type: request.inputType,
        payload: {
          prompt: request.prompt,
          context: request.context,
          workspace: request.workspace
        },
        user_id: request.userId,
        company_id: request.companyId
      }
    });

    if (error) throw error;

    return {
      id: crypto.randomUUID(),
      response: data.response,
      model: model.model,
      provider: 'relevance',
      tokensUsed: 0, // Relevance AI handles this differently
      processingTime: Date.now() - startTime,
      confidence: 0.88,
      suggestedActions: data.suggested_actions || []
    };
  }

  private generateSimulationResponse(requestId: string, request: AIRequest, model: AIModelConfig, startTime: number): AIResponse {
    const simulationResponses = {
      sales: {
        chat: "AI Sales Assistant ready for activation. Lead analysis and email generation prepared.",
        automation: "Sales automation workflows ready. Email sequences and follow-ups prepared for launch.",
        analysis: "Lead analysis engine ready. Scoring and prioritization algorithms prepared."
      },
      manager: {
        chat: "AI Manager Assistant ready for activation. Team insights and strategic planning prepared.",
        automation: "Management automation ready. Report generation and team notifications prepared.",
        analysis: "Performance analytics engine ready. Team metrics and forecasting prepared."
      },
      developer: {
        chat: "AI Developer Assistant ready for activation. System monitoring and optimization prepared.",
        automation: "Developer automation ready. Error detection and resolution workflows prepared.",
        analysis: "System analysis engine ready. Performance monitoring and debugging prepared."
      }
    };

    const response = simulationResponses[request.workspace]?.[request.inputType] || 
                    "AI system ready for activation. All models and agents prepared for launch.";

    return {
      id: requestId,
      response,
      model: model.model,
      provider: model.provider,
      tokensUsed: 0,
      processingTime: Date.now() - startTime,
      confidence: 0.95,
      suggestedActions: ['Activate AI system', 'Test with real data', 'Monitor performance']
    };
  }

  private getSystemPrompt(workspace: string, agentType: string): string {
    const prompts = {
      'sales-chat': 'You are an expert sales AI assistant. Help with lead analysis, email drafting, and sales strategy.',
      'sales-automation': 'You are a sales automation specialist. Focus on email sequences, follow-ups, and lead nurturing.',
      'manager-chat': 'You are a strategic management AI assistant. Provide team insights, performance analysis, and strategic guidance.',
      'manager-automation': 'You are a management automation specialist. Focus on team notifications, report generation, and goal tracking.',
      'developer-chat': 'You are a developer AI assistant. Help with system monitoring, error analysis, and optimization.',
      'developer-automation': 'You are a developer automation specialist. Focus on system health, error resolution, and performance monitoring.'
    };

    return prompts[`${workspace}-${agentType}`] || 'You are a helpful AI assistant.';
  }

  private async logRequest(requestId: string, request: AIRequest): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_ai_inputs')
        .insert({
          request_id: requestId,
          user_id: request.userId,
          company_id: request.companyId,
          workspace: request.workspace,
          agent_type: request.agentType,
          input_type: request.inputType,
          prompt: request.prompt,
          context: request.context,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to log AI request:', error);
      }
    } catch (error) {
      logger.error('Error logging AI request:', error);
    }
  }

  private async logResponse(requestId: string, response: AIResponse): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_logs')
        .insert({
          interaction_id: requestId,
          response_data: {
            response: response.response,
            model: response.model,
            provider: response.provider,
            tokens_used: response.tokensUsed,
            processing_time: response.processingTime,
            confidence: response.confidence
          },
          status: 'completed',
          timestamp: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to log AI response:', error);
      }
    } catch (error) {
      logger.error('Error logging AI response:', error);
    }
  }

  private async logError(requestId: string, request: AIRequest, error: Error): Promise<void> {
    try {
      const { error: dbError } = await supabase
        .from('ai_agent_logs')
        .insert({
          interaction_id: requestId,
          user_id: request.userId,
          company_id: request.companyId,
          agent_type: request.agentType,
          status: 'error',
          error_message: error.message,
          timestamp: new Date().toISOString()
        });

      if (dbError) {
        logger.error('Failed to log AI error:', dbError);
      }
    } catch (logError) {
      logger.error('Error logging AI error:', logError);
    }
  }

  // System control methods
  async goLive(): Promise<void> {
    this.isLive = true;
    
    // Activate all models
    for (const [id, model] of this.models) {
      model.isActive = true;
    }

    // Activate master brain agents
    await masterAIBrain.enableAllAgents();

    logger.info('🚀 AI ORCHESTRATOR LIVE - All models and agents activated');
  }

  async getSystemStatus() {
    const brainStatus = masterAIBrain.getSystemStatus();
    const totalModels = this.models.size;
    const activeModels = Array.from(this.models.values()).filter(m => m.isActive).length;

    return {
      isLive: this.isLive,
      totalModels,
      activeModels,
      brainStatus,
      models: Array.from(this.models.entries()).map(([id, config]) => ({
        id,
        provider: config.provider,
        model: config.model,
        isActive: config.isActive,
        capabilities: config.capabilities
      }))
    };
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();
