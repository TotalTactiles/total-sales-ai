
import { voiceService } from './voiceService';
import { hybridAIOrchestrator } from './hybridAIOrchestrator';
import { aiLearningLayer } from './aiLearningLayer';

interface VoiceCommand {
  transcript: string;
  confidence: number;
  intent: string;
  parameters: Record<string, any>;
}

interface VoiceResponse {
  text: string;
  audio?: Blob;
  action?: {
    type: string;
    data: any;
  };
}

export class EnhancedVoiceService {
  private static instance: EnhancedVoiceService;
  private isListening = false;
  private wakeWords = ['hey assistant', 'hey jarvis', 'hey ai'];
  private currentAssistantName = 'Assistant';

  static getInstance(): EnhancedVoiceService {
    if (!EnhancedVoiceService.instance) {
      EnhancedVoiceService.instance = new EnhancedVoiceService();
    }
    return EnhancedVoiceService.instance;
  }

  setAssistantName(name: string): void {
    this.currentAssistantName = name;
    this.wakeWords = [
      `hey ${name.toLowerCase()}`,
      'hey assistant', 
      'hey ai'
    ];
  }

  async startListening(userId: string, companyId: string): Promise<boolean> {
    try {
      this.isListening = true;
      const started = await voiceService.startRecording();
      
      if (started) {
        // Log voice interaction start
        await aiLearningLayer.ingestLearningData({
          userId,
          companyId,
          dataType: 'user_interaction',
          content: { action: 'voice_listening_started' },
          source: 'enhanced_voice_service',
          confidence: 1.0
        });
      }
      
      return started;
    } catch (error) {
      console.error('Failed to start voice listening:', error);
      this.isListening = false;
      return false;
    }
  }

  async stopListening(): Promise<VoiceCommand | null> {
    try {
      this.isListening = false;
      const audioBlob = await voiceService.stopRecording();
      
      if (!audioBlob || audioBlob.size === 0) {
        return null;
      }

      const transcript = await voiceService.processAudioCommand(audioBlob, 'current-user');
      
      if (!transcript || transcript.trim().length === 0) {
        return null;
      }

      // Analyze the command
      const command = await this.analyzeVoiceCommand(transcript);
      return command;
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      return null;
    }
  }

  private async analyzeVoiceCommand(transcript: string): Promise<VoiceCommand> {
    const lowerTranscript = transcript.toLowerCase();
    
    // Detect wake word
    const hasWakeWord = this.wakeWords.some(wake => lowerTranscript.includes(wake));
    
    // Extract intent and parameters
    let intent = 'general_query';
    const parameters: Record<string, any> = {};
    
    if (lowerTranscript.includes('priority') && lowerTranscript.includes('today')) {
      intent = 'get_daily_priorities';
    } else if (lowerTranscript.includes('call') || lowerTranscript.includes('phone')) {
      intent = 'initiate_call';
      // Try to extract contact name
      const callMatch = lowerTranscript.match(/call (.+?)(?:\s|$)/);
      if (callMatch) {
        parameters.contactName = callMatch[1];
      }
    } else if (lowerTranscript.includes('email') || lowerTranscript.includes('send')) {
      intent = 'compose_email';
    } else if (lowerTranscript.includes('schedule') || lowerTranscript.includes('meeting')) {
      intent = 'schedule_meeting';
    } else if (lowerTranscript.includes('status') || lowerTranscript.includes('update')) {
      intent = 'get_status_update';
    } else if (lowerTranscript.includes('lead') || lowerTranscript.includes('prospect')) {
      intent = 'lead_management';
    }

    return {
      transcript,
      confidence: hasWakeWord ? 0.9 : 0.7,
      intent,
      parameters
    };
  }

  async processVoiceCommand(
    command: VoiceCommand, 
    userId: string, 
    companyId: string,
    context: Record<string, any> = {}
  ): Promise<VoiceResponse> {
    try {
      // Log the voice command
      await aiLearningLayer.ingestLearningData({
        userId,
        companyId,
        dataType: 'user_interaction',
        content: {
          action: 'voice_command',
          intent: command.intent,
          transcript: command.transcript,
          confidence: command.confidence
        },
        source: 'enhanced_voice_service',
        confidence: command.confidence
      });

      // Process command through hybrid AI orchestrator
      const aiTask = {
        id: crypto.randomUUID(),
        type: 'conversation' as const,
        input: `Voice command: "${command.transcript}". Intent: ${command.intent}. Please provide a helpful response and suggest any actions.`,
        context: `Voice interaction for ${command.intent}. User context: ${JSON.stringify(context)}`,
        priority: 'high' as const,
        userId,
        companyId
      };

      const response = await hybridAIOrchestrator.processTask(aiTask);
      
      // Generate voice response
      const voiceResponse: VoiceResponse = {
        text: response.result
      };

      // Add action based on intent
      switch (command.intent) {
        case 'initiate_call':
          voiceResponse.action = {
            type: 'initiate_call',
            data: { contactName: command.parameters.contactName }
          };
          break;
        case 'compose_email':
          voiceResponse.action = {
            type: 'open_email_composer',
            data: {}
          };
          break;
        case 'schedule_meeting':
          voiceResponse.action = {
            type: 'open_calendar',
            data: {}
          };
          break;
        case 'get_daily_priorities':
          voiceResponse.action = {
            type: 'show_priorities',
            data: {}
          };
          break;
      }

      // Generate audio response
      try {
        await voiceService.generateVoiceResponse(voiceResponse.text);
      } catch (error) {
        console.error('Failed to generate voice response:', error);
        // Continue without audio
      }

      return voiceResponse;
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      
      return {
        text: "I'm sorry, I couldn't process that command. Could you please try again?",
        action: {
          type: 'show_error',
          data: { message: 'Voice command processing failed' }
        }
      };
    }
  }

  async speakResponse(text: string): Promise<void> {
    try {
      await voiceService.generateVoiceResponse(text);
    } catch (error) {
      console.error('Failed to speak response:', error);
    }
  }

  getListeningStatus(): boolean {
    return this.isListening;
  }

  getWakeWords(): string[] {
    return [...this.wakeWords];
  }
}

export const enhancedVoiceService = EnhancedVoiceService.getInstance();
