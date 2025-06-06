
import { supabase } from '@/integrations/supabase/client';
import { unifiedAIService } from './unifiedAIService';
import { elevenLabsService } from './elevenLabsService';
import { retellAIService } from './retellAIService';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { encodeBase64 } from '@/services/security/base64Service';

export interface VoiceAIConfig {
  workspace: 'sales' | 'manager' | 'developer';
  userId: string;
  leadContext?: any;
  callContext?: any;
}

export class VoiceAIService {
  private static instance: VoiceAIService;
  private isInitialized = false;
  private currentConfig: VoiceAIConfig | null = null;

  static getInstance(): VoiceAIService {
    if (!VoiceAIService.instance) {
      VoiceAIService.instance = new VoiceAIService();
    }
    return VoiceAIService.instance;
  }

  async initialize(config: VoiceAIConfig): Promise<boolean> {
    try {
      this.currentConfig = config;
      
      // Initialize all voice services
      await Promise.all([
        elevenLabsService.initialize(),
        retellAIService.initialize()
      ]);

      this.isInitialized = true;
      logger.info('Voice AI service initialized successfully', { workspace: config.workspace }, 'voice_ai');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Voice AI service', error, 'voice_ai');
      this.isInitialized = false;
      return false;
    }
  }

  async processVoiceCommand(audioBlob: Blob, context: string): Promise<string> {
    if (!this.isInitialized || !this.currentConfig) {
      throw new Error('Voice AI service not initialized');
    }

    try {
      // Convert audio to text
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { 
          audio: await this.blobToBase64(audioBlob),
          userId: this.currentConfig.userId,
          workspace: this.currentConfig.workspace
        }
      });

      if (error) throw error;
      
      const transcription = data.text;
      if (!transcription) throw new Error('No transcription received');

      // Process with AI based on workspace
      const aiResponse = await this.processWithWorkspaceAI(transcription, context);
      
      // Generate voice response
      await this.generateVoiceResponse(aiResponse);
      
      return transcription;
    } catch (error) {
      logger.error('Voice command processing failed', error, 'voice_ai');
      throw error;
    }
  }

  private async processWithWorkspaceAI(text: string, context: string): Promise<string> {
    if (!this.currentConfig) throw new Error('No configuration available');

    const prompt = this.buildWorkspacePrompt(text, context);
    const response = await unifiedAIService.generateResponse(prompt, undefined, this.currentConfig.workspace);
    
    return response.response;
  }

  private buildWorkspacePrompt(text: string, context: string): string {
    if (!this.currentConfig) return text;

    const { workspace, leadContext, callContext } = this.currentConfig;
    
    let prompt = `User said: "${text}"\nContext: ${context}\n`;
    
    if (workspace === 'sales') {
      prompt += `You are a Sales AI Assistant. Help with lead management, calling, and sales tasks.`;
      if (leadContext) {
        prompt += `\nCurrent lead: ${leadContext.name} (${leadContext.status})`;
      }
    } else if (workspace === 'manager') {
      prompt += `You are a Manager AI Assistant. Help with team oversight, analytics, and strategic decisions.`;
    } else if (workspace === 'developer') {
      prompt += `You are a Developer AI Assistant. Help with debugging, system monitoring, and technical tasks.`;
    }
    
    return prompt;
  }

  private async generateVoiceResponse(text: string): Promise<void> {
    try {
      const audioUrl = await elevenLabsService.generateSpeech(text);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
      }
    } catch (error) {
      logger.warn('ElevenLabs failed, using browser speech', error, 'voice_ai');
      // Fallback to browser speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
      }
    }
  }

  async initiateAICall(
    phoneNumber: string,
    leadId: string,
    leadName: string,
    userId: string,
    leadContext: any
  ): Promise<{ success: boolean; callId?: string }> {
    try {
      const result = await retellAIService.initiateCall({
        phoneNumber,
        leadId,
        leadName,
        userId,
        leadContext,
        agentConfig: {
          agent_name: `Sales AI for ${leadName}`,
          voice_id: 'pNInz6obpgDQGcFmaJgB',
          voice_temperature: 0.7,
          voice_speed: 1.0,
          response_engine: {
            type: 'retell-llm',
            llm_id: 'gpt-4o-mini'
          },
          language: 'en-US',
          interruption_sensitivity: 0.5,
          ambient_sound: 'office',
          agent_prompt: `You are a professional sales representative calling ${leadName}. Be friendly, professional, and focus on understanding their needs.`
        }
      });

      if (result.success) {
        logger.info('AI call initiated successfully', { leadName, callId: result.callId }, 'voice_ai');
        toast.success(`AI call started with ${leadName}`);
      }

      return result;
    } catch (error) {
      logger.error('Failed to initiate AI call', error, 'voice_ai');
      toast.error('Failed to start AI call');
      return { success: false };
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = encodeBase64(new Uint8Array(arrayBuffer));
    return base64;
  }

  isServiceReady(): boolean {
    return this.isInitialized;
  }
}

export const voiceAIService = VoiceAIService.getInstance();
