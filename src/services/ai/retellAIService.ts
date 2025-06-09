
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

const AI_TYPE = 'retell_ai';

export interface RetellAgentConfig {
  agent_name: string;
  voice_id: string;
  voice_temperature: number;
  voice_speed: number;
  response_engine: {
    type: string;
    llm_id: string;
  };
  language: string;
  interruption_sensitivity: number;
  ambient_sound: string;
  agent_prompt: string;
}

export interface RetellCallOptions {
  phoneNumber: string;
  leadId: string;
  leadName: string;
  userId: string;
  leadContext: any;
  agentConfig?: Partial<RetellAgentConfig>;
}

export class RetellAIService {
  private static instance: RetellAIService;
  private isInitialized = false;

  private async logAIBrain(event: {
    summary: string;
    payload: any;
    agentId?: string;
    errorType?: string | null;
  }): Promise<void> {
    try {
      await supabase.from('ai_brain_logs').insert({
        type: 'system_log',
        event_summary: event.summary,
        payload: event.payload,
        agent_id: event.agentId || null,
        ai_type: AI_TYPE,
        error_type: event.errorType || null,
        visibility: 'admin_only'
      });
    } catch (e) {
      logger.error('Failed to log Retell AI event', e, 'retell_ai');
    }
  }

  static getInstance(): RetellAIService {
    if (!RetellAIService.instance) {
      RetellAIService.instance = new RetellAIService();
    }
    return RetellAIService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Test Retell AI connection
      const { data, error } = await supabase.functions.invoke('retell-ai', {
        body: { test: true }
      });

      if (error) throw error;

      this.isInitialized = true;
      logger.info('Retell AI service initialized successfully', { data }, 'retell_ai');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Retell AI service', error, 'retell_ai');
      this.isInitialized = false;
      return false;
    }
  }

  async createConversationalAgent(config: RetellAgentConfig): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { data, error } = await supabase.functions.invoke('retell-ai', {
        body: { config }
      });

      if (error) throw error;

      logger.info('Conversational agent created', { agentId: data.agent_id }, 'retell_ai');
      await this.logAIBrain({
        summary: 'Retell agent created',
        payload: { config },
        agentId: data.agent_id
      });
      return data.agent_id;
    } catch (error) {
      logger.error('Failed to create conversational agent', error, 'retell_ai');
      await this.logAIBrain({
        summary: 'Retell agent creation failed',
        payload: { config, error: error instanceof Error ? error.message : error },
        errorType: 'agent_creation_error'
      });
      toast.error('Failed to create AI agent');
      return null;
    }
  }

  async initiateCall(options: RetellCallOptions): Promise<{ success: boolean; callId?: string; error?: string }> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Retell AI service not available');
        }
      }

      const { data, error } = await supabase.functions.invoke('retell-ai', {
        body: { ...options }
      });

      if (error) throw error;

      logger.info('Retell AI call initiated', {
        callId: data.callId,
        phoneNumber: options.phoneNumber,
        leadName: options.leadName,
        leadId: options.leadId,
        userId: options.userId
      }, 'retell_ai');

      await this.logAIBrain({
        summary: 'Retell call initiated',
        agentId: data.agentId,
        payload: { ...options, callId: data.callId }
      });

      toast.success(`AI Assistant is calling ${options.leadName}...`);

      return {
        success: true,
        callId: data.callId
      };
    } catch (error) {
      logger.error('Failed to initiate Retell AI call', error, 'retell_ai');
      await this.logAIBrain({
        summary: 'Retell call initiation failed',
        payload: { ...options, error: error instanceof Error ? error.message : error },
        errorType: 'call_initiation_error'
      });
      toast.error('Failed to initiate AI call');

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCallAnalysis(callId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('retell-ai', {
        body: { callId }
      });

      if (error) throw error;
      await this.logAIBrain({
        summary: 'Retrieved call analysis',
        agentId: data?.agentId,
        payload: { callId }
      });
      return data;
    } catch (error) {
      logger.error('Failed to get call analysis', error, 'retell_ai');
      await this.logAIBrain({
        summary: 'Call analysis retrieval failed',
        payload: { callId, error: error instanceof Error ? error.message : error },
        errorType: 'analysis_error'
      });
      return null;
    }
  }

  isServiceReady(): boolean {
    return this.isInitialized;
  }
}

export const retellAIService = RetellAIService.getInstance();
