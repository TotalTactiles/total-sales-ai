
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

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
  leadName: string;
  leadId: string;
  userId: string;
  leadContext: any;
  agentConfig?: Partial<RetellAgentConfig>;
}

export class RetellAIService {
  private static instance: RetellAIService;
  private isInitialized = false;

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
      return data.agent_id;
    } catch (error) {
      logger.error('Failed to create conversational agent', error, 'retell_ai');
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
        leadName: options.leadName 
      }, 'retell_ai');

      toast.success(`AI Assistant is calling ${options.leadName}...`);
      
      return {
        success: true,
        callId: data.callId
      };
    } catch (error) {
      logger.error('Failed to initiate Retell AI call', error, 'retell_ai');
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
      return data;
    } catch (error) {
      logger.error('Failed to get call analysis', error, 'retell_ai');
      return null;
    }
  }

  isServiceReady(): boolean {
    return this.isInitialized;
  }
}

export const retellAIService = RetellAIService.getInstance();
