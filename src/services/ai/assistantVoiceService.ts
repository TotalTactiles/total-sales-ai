
import { logger } from '@/utils/logger';
import { voiceService } from './voiceService';
import { enhancedVoiceService } from './enhancedVoiceService';

interface VoiceCommand {
  transcript: string;
  confidence: number;
  intent: string;
  parameters: Record<string, any>;
  leadContext?: any;
}

interface VoiceResponse {
  text: string;
  action?: {
    type: string;
    data: any;
  };
  success: boolean;
}

export class AssistantVoiceService {
  private static instance: AssistantVoiceService;
  private isListening = false;
  private isWakeWordMode = false;
  private wakeWords = ['hey tsam', 'hey assistant', 'tsam'];
  private currentLead: any = null;
  private onCommandCallback: ((command: string) => void) | null = null;
  private onWakeWordDetected: (() => void) | null = null;
  private continuousListening = false;
  private recognition: any = null;

  static getInstance(): AssistantVoiceService {
    if (!AssistantVoiceService.instance) {
      AssistantVoiceService.instance = new AssistantVoiceService();
    }
    return AssistantVoiceService.instance;
  }

  private initializeWebSpeechAPI(): boolean {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      logger.warn('Web Speech API not supported');
      return false;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    
    return true;
  }

  setLeadContext(lead: any): void {
    this.currentLead = lead;
  }

  setCommandCallback(callback: (command: string) => void): void {
    this.onCommandCallback = callback;
  }

  setWakeWordCallback(callback: () => void): void {
    this.onWakeWordDetected = callback;
  }

  async startListening(wakeWordMode = false): Promise<boolean> {
    try {
      // Initialize Web Speech API if not already done
      if (!this.recognition && !this.initializeWebSpeechAPI()) {
        logger.error('Speech recognition not available');
        return false;
      }

      this.isListening = true;
      this.isWakeWordMode = wakeWordMode;
      this.continuousListening = wakeWordMode;
      
      // Set up event handlers
      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = (finalTranscript + interimTranscript).toLowerCase().trim();
        
        if (wakeWordMode && this.checkForWakeWord(fullTranscript)) {
          logger.info('Wake word detected:', fullTranscript);
          if (this.onWakeWordDetected) {
            this.onWakeWordDetected();
          }
          
          // Switch to command mode
          this.continuousListening = false;
          this.isWakeWordMode = false;
          
          // Restart for actual command
          setTimeout(() => {
            if (this.isListening) {
              this.recognition.start();
            }
          }, 500);
        } else if (!wakeWordMode && finalTranscript) {
          // Process the actual command
          this.processCommand(finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        logger.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech' && this.continuousListening) {
          // Restart for continuous listening
          setTimeout(() => {
            if (this.isListening && this.continuousListening) {
              this.recognition.start();
            }
          }, 1000);
        }
      };

      this.recognition.onend = () => {
        if (this.continuousListening && this.isListening) {
          // Restart for continuous listening
          setTimeout(() => {
            if (this.isListening) {
              this.recognition.start();
            }
          }, 100);
        }
      };

      this.recognition.start();
      logger.info(`Voice listening started${wakeWordMode ? ' (wake word mode)' : ''}`);
      
      return true;
    } catch (error) {
      logger.error('Failed to start voice listening:', error);
      this.isListening = false;
      return false;
    }
  }

  async stopListening(): Promise<VoiceCommand | null> {
    try {
      this.isListening = false;
      this.continuousListening = false;
      
      if (this.recognition) {
        this.recognition.stop();
      }
      
      return null; // Command is processed in real-time via onresult
      
    } catch (error) {
      logger.error('Error stopping voice listening:', error);
      return null;
    }
  }

  private processCommand(transcript: string): void {
    if (this.onCommandCallback) {
      this.onCommandCallback(transcript);
    }
  }

  private checkForWakeWord(transcript: string): boolean {
    const lowerTranscript = transcript.toLowerCase();
    return this.wakeWords.some(wake => lowerTranscript.includes(wake));
  }

  private async analyzeVoiceCommand(transcript: string): Promise<VoiceCommand> {
    const lowerTranscript = transcript.toLowerCase();
    
    // Check for wake word
    const hasWakeWord = this.checkForWakeWord(transcript);
    
    let intent = 'general_query';
    const parameters: Record<string, any> = {};
    
    // Lead management commands
    if (lowerTranscript.includes('update') && lowerTranscript.includes('status')) {
      intent = 'update_lead_status';
      const statusMatch = lowerTranscript.match(/status to (hot|warm|cold|qualified|negotiation|closed)/);
      if (statusMatch) {
        parameters.status = statusMatch[1];
      }
    } else if (lowerTranscript.includes('update') && lowerTranscript.includes('score')) {
      intent = 'update_lead_score';
      const scoreMatch = lowerTranscript.match(/score to (\d+)/);
      if (scoreMatch) {
        parameters.score = parseInt(scoreMatch[1]);
      }
    } else if (lowerTranscript.includes('add note') || lowerTranscript.includes('create note')) {
      intent = 'add_note';
      const noteMatch = lowerTranscript.match(/note[:\s]+(.*)/);
      if (noteMatch) {
        parameters.note = noteMatch[1];
      }
    } else if (lowerTranscript.includes('call') || lowerTranscript.includes('phone')) {
      intent = 'initiate_call';
      parameters.leadId = this.currentLead?.id;
    } else if (lowerTranscript.includes('email') || lowerTranscript.includes('send')) {
      intent = 'compose_email';
      parameters.leadId = this.currentLead?.id;
    } else if (lowerTranscript.includes('remind me') || lowerTranscript.includes('follow up')) {
      intent = 'create_reminder';
      const timeMatch = lowerTranscript.match(/in (\d+) (day|days|week|weeks|hour|hours)/);
      if (timeMatch) {
        parameters.timeframe = `${timeMatch[1]} ${timeMatch[2]}`;
      }
    } else if (lowerTranscript.includes('schedule') || lowerTranscript.includes('meeting')) {
      intent = 'schedule_meeting';
      parameters.leadId = this.currentLead?.id;
    } else if (lowerTranscript.includes('analyze') || lowerTranscript.includes('insights')) {
      intent = 'analyze_lead';
      parameters.leadId = this.currentLead?.id;
    }

    return {
      transcript,
      confidence: hasWakeWord ? 0.9 : 0.7,
      intent,
      parameters,
      leadContext: this.currentLead
    };
  }

  async executeVoiceCommand(command: VoiceCommand): Promise<VoiceResponse> {
    try {
      let response: VoiceResponse = {
        text: "I understood your command but couldn't execute it.",
        success: false
      };

      switch (command.intent) {
        case 'update_lead_status':
          if (command.parameters.status && this.currentLead) {
            response = {
              text: `Updated ${this.currentLead.name}'s status to ${command.parameters.status}`,
              action: {
                type: 'update_lead_field',
                data: { field: 'status', value: command.parameters.status }
              },
              success: true
            };
          }
          break;

        case 'update_lead_score':
          if (command.parameters.score && this.currentLead) {
            response = {
              text: `Updated ${this.currentLead.name}'s score to ${command.parameters.score}`,
              action: {
                type: 'update_lead_field',
                data: { field: 'score', value: command.parameters.score }
              },
              success: true
            };
          }
          break;

        case 'add_note':
          if (command.parameters.note && this.currentLead) {
            response = {
              text: `Added note: "${command.parameters.note}" to ${this.currentLead.name}`,
              action: {
                type: 'add_note',
                data: { 
                  note: command.parameters.note,
                  source: 'voice_command',
                  leadId: this.currentLead.id
                }
              },
              success: true
            };
          }
          break;

        case 'initiate_call':
          if (this.currentLead) {
            response = {
              text: `Initiating call with ${this.currentLead.name}`,
              action: {
                type: 'initiate_call',
                data: { leadId: this.currentLead.id }
              },
              success: true
            };
          }
          break;

        case 'compose_email':
          if (this.currentLead) {
            response = {
              text: `Opening email composer for ${this.currentLead.name}`,
              action: {
                type: 'compose_email',
                data: { leadId: this.currentLead.id }
              },
              success: true
            };
          }
          break;

        case 'create_reminder':
          if (command.parameters.timeframe && this.currentLead) {
            response = {
              text: `Created reminder to follow up with ${this.currentLead.name} in ${command.parameters.timeframe}`,
              action: {
                type: 'create_reminder',
                data: { 
                  leadId: this.currentLead.id,
                  timeframe: command.parameters.timeframe,
                  message: `Follow up with ${this.currentLead.name}`
                }
              },
              success: true
            };
          }
          break;

        case 'schedule_meeting':
          if (this.currentLead) {
            response = {
              text: `Opening calendar to schedule meeting with ${this.currentLead.name}`,
              action: {
                type: 'schedule_meeting',
                data: { leadId: this.currentLead.id }
              },
              success: true
            };
          }
          break;

        case 'analyze_lead':
          if (this.currentLead) {
            response = {
              text: `Analyzing ${this.currentLead.name}'s behavior and generating insights`,
              action: {
                type: 'analyze_lead',
                data: { leadId: this.currentLead.id }
              },
              success: true
            };
          }
          break;

        default:
          // Send to chat for general queries
          if (this.onCommandCallback) {
            this.onCommandCallback(command.transcript);
          }
          response = {
            text: `Processing your request: "${command.transcript}"`,
            success: true
          };
      }

      // Generate voice response
      await voiceService.generateVoiceResponse(response.text);
      
      logger.info('Voice command executed successfully', {
        intent: command.intent,
        success: response.success
      });

      return response;
      
    } catch (error) {
      logger.error('Error executing voice command:', error);
      
      const errorResponse = {
        text: "I'm sorry, I couldn't execute that command. Could you please try again?",
        success: false
      };
      
      await voiceService.generateVoiceResponse(errorResponse.text);
      return errorResponse;
    }
  }

  getListeningStatus(): boolean {
    return this.isListening;
  }

  getWakeWords(): string[] {
    return [...this.wakeWords];
  }
}

export const assistantVoiceService = AssistantVoiceService.getInstance();
