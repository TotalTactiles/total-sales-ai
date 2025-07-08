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
  private isAlwaysListening = true;
  private learningMode = true;
  private userBehaviorLog: Array<{
    action: string;
    context: string;
    timestamp: Date;
    workspace: string;
  }> = [];

  static getInstance(): AssistantVoiceService {
    if (!AssistantVoiceService.instance) {
      AssistantVoiceService.instance = new AssistantVoiceService();
    }
    return AssistantVoiceService.instance;
  }

  constructor() {
    this.initializeAlwaysListening();
  }

  private async initializeAlwaysListening(): Promise<void> {
    try {
      if (this.isAlwaysListening) {
        await this.startWakeWordDetection();
        logger.info('Always listening mode initialized');
      }
    } catch (error) {
      logger.error('Failed to initialize always listening mode:', error);
    }
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

  async startWakeWordDetection(): Promise<boolean> {
    try {
      if (!this.recognition && !this.initializeWebSpeechAPI()) {
        logger.error('Speech recognition not available');
        return false;
      }

      this.isListening = true;
      this.isWakeWordMode = true;
      this.continuousListening = true;
      
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
        
        if (this.checkForWakeWord(fullTranscript)) {
          logger.info('Wake word detected:', fullTranscript);
          this.handleWakeWordDetection(fullTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        logger.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech' && this.continuousListening) {
          setTimeout(() => {
            if (this.isListening && this.continuousListening) {
              this.recognition.start();
            }
          }, 1000);
        }
      };

      this.recognition.onend = () => {
        if (this.continuousListening && this.isListening) {
          setTimeout(() => {
            if (this.isListening) {
              this.recognition.start();
            }
          }, 100);
        }
      };

      this.recognition.start();
      logger.info('Wake word detection started');
      
      return true;
    } catch (error) {
      logger.error('Failed to start wake word detection:', error);
      return false;
    }
  }

  private handleWakeWordDetection(transcript: string): void {
    // Extract command after wake word
    const command = this.extractCommandFromTranscript(transcript);
    
    if (this.onWakeWordDetected) {
      this.onWakeWordDetected();
    }

    if (command) {
      this.processVoiceCommand(command);
    } else {
      // Switch to command listening mode
      this.isWakeWordMode = false;
      setTimeout(() => {
        this.startCommandListening();
      }, 500);
    }
  }

  private extractCommandFromTranscript(transcript: string): string | null {
    const lowerTranscript = transcript.toLowerCase();
    
    for (const wakeWord of this.wakeWords) {
      const wakeWordIndex = lowerTranscript.indexOf(wakeWord);
      if (wakeWordIndex !== -1) {
        const commandStart = wakeWordIndex + wakeWord.length;
        const command = transcript.substring(commandStart).trim();
        return command.length > 0 ? command : null;
      }
    }
    
    return null;
  }

  private async startCommandListening(): Promise<void> {
    try {
      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
          this.processVoiceCommand(finalTranscript.trim());
          // Return to wake word mode
          setTimeout(() => {
            this.isWakeWordMode = true;
            this.startWakeWordDetection();
          }, 1000);
        }
      };

      this.recognition.start();
    } catch (error) {
      logger.error('Failed to start command listening:', error);
    }
  }

  private async processVoiceCommand(command: string): Promise<void> {
    try {
      logger.info('Processing voice command:', command);
      
      const voiceCommand = await this.analyzeVoiceCommand(command);
      const response = await this.executeVoiceCommand(voiceCommand);
      
      if (this.onCommandCallback) {
        this.onCommandCallback(command);
      }

      // Log user behavior for learning
      this.logUserBehavior('voice_command', command, this.getCurrentWorkspace());
      
      logger.info('Voice command processed successfully');
    } catch (error) {
      logger.error('Failed to process voice command:', error);
    }
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
      if (!this.recognition && !this.initializeWebSpeechAPI()) {
        logger.error('Speech recognition not available');
        return false;
      }

      this.isListening = true;
      this.isWakeWordMode = wakeWordMode;
      this.continuousListening = wakeWordMode;
      
      if (wakeWordMode) {
        return await this.startWakeWordDetection();
      } else {
        return await this.startCommandListening();
      }
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
      
      return null;
      
    } catch (error) {
      logger.error('Error stopping voice listening:', error);
      return null;
    }
  }

  private checkForWakeWord(transcript: string): boolean {
    const lowerTranscript = transcript.toLowerCase();
    return this.wakeWords.some(wake => lowerTranscript.includes(wake));
  }

  private async analyzeVoiceCommand(transcript: string): Promise<VoiceCommand> {
    const lowerTranscript = transcript.toLowerCase();
    
    let intent = 'general_query';
    const parameters: Record<string, any> = {};
    
    // Enhanced intent detection with delegation logic
    if (lowerTranscript.includes('remind me') || lowerTranscript.includes('schedule')) {
      intent = 'create_reminder';
      parameters.delegateTo = 'automation_agent';
    } else if (lowerTranscript.includes('follow up')) {
      intent = 'create_followup';
      parameters.delegateTo = 'automation_agent';
    } else if (lowerTranscript.includes('update') && lowerTranscript.includes('status')) {
      intent = 'update_lead_status';
      parameters.delegateTo = 'lead_agent';
    } else if (lowerTranscript.includes('analyze') || lowerTranscript.includes('insights')) {
      intent = 'analyze_data';
      parameters.delegateTo = 'company_brain';
    } else if (lowerTranscript.includes('call') || lowerTranscript.includes('phone')) {
      intent = 'initiate_call';
      parameters.delegateTo = 'dialer_agent';
    } else if (lowerTranscript.includes('email') || lowerTranscript.includes('send')) {
      intent = 'compose_email';
      parameters.delegateTo = 'automation_agent';
    }

    return {
      transcript,
      confidence: 0.8,
      intent,
      parameters,
      leadContext: this.currentLead
    };
  }

  async executeVoiceCommand(command: VoiceCommand): Promise<VoiceResponse> {
    try {
      let response: VoiceResponse = {
        text: "I understood your command and I'm processing it now.",
        success: false
      };

      // Delegate to appropriate agent if specified
      if (command.parameters.delegateTo) {
        response = await this.delegateToAgent(command);
      } else {
        // Execute directly
        response = await this.executeDirectCommand(command);
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

  private async delegateToAgent(command: VoiceCommand): Promise<VoiceResponse> {
    try {
      const agentType = command.parameters.delegateTo;
      
      // This would integrate with your existing Relevance AI agents
      switch (agentType) {
        case 'automation_agent':
          return await this.delegateToAutomationAgent(command);
        case 'lead_agent':
          return await this.delegateToLeadAgent(command);
        case 'company_brain':
          return await this.delegateToCompanyBrain(command);
        case 'dialer_agent':
          return await this.delegateToDialerAgent(command);
        default:
          return await this.executeDirectCommand(command);
      }
    } catch (error) {
      logger.error('Agent delegation failed:', error);
      return {
        text: "I encountered an issue while processing your request. Let me handle it directly.",
        success: false
      };
    }
  }

  private async delegateToAutomationAgent(command: VoiceCommand): Promise<VoiceResponse> {
    // Integration with automation agent
    return {
      text: `I've created the automation for: "${command.transcript}"`,
      action: {
        type: 'automation_created',
        data: { command: command.transcript }
      },
      success: true
    };
  }

  private async delegateToLeadAgent(command: VoiceCommand): Promise<VoiceResponse> {
    // Integration with lead management agent
    return {
      text: `I've updated the lead information based on: "${command.transcript}"`,
      action: {
        type: 'lead_updated',
        data: { command: command.transcript }
      },
      success: true
    };
  }

  private async delegateToCompanyBrain(command: VoiceCommand): Promise<VoiceResponse> {
    // Integration with company brain for analytics
    return {
      text: `I've analyzed the data for: "${command.transcript}"`,
      action: {
        type: 'analysis_complete',
        data: { command: command.transcript }
      },
      success: true
    };
  }

  private async delegateToDialerAgent(command: VoiceCommand): Promise<VoiceResponse> {
    // Integration with dialer functionality
    return {
      text: `I'm initiating the call based on: "${command.transcript}"`,
      action: {
        type: 'call_initiated',
        data: { command: command.transcript }
      },
      success: true
    };
  }

  private async executeDirectCommand(command: VoiceCommand): Promise<VoiceResponse> {
    switch (command.intent) {
      case 'update_lead_status':
        if (command.parameters.status && this.currentLead) {
          return {
            text: `Updated ${this.currentLead.name}'s status to ${command.parameters.status}`,
            action: {
              type: 'update_lead_field',
              data: { field: 'status', value: command.parameters.status }
            },
            success: true
          };
        }
        break;

      case 'add_note':
        if (command.parameters.note && this.currentLead) {
          return {
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

      default:
        return {
          text: `Processing your request: "${command.transcript}"`,
          success: true
        };
    }

    return {
      text: "I understood your command but couldn't execute it.",
      success: false
    };
  }

  // Learning and behavior tracking
  private logUserBehavior(action: string, context: string, workspace: string): void {
    if (!this.learningMode) return;

    this.userBehaviorLog.push({
      action,
      context,
      timestamp: new Date(),
      workspace
    });

    // Keep only last 100 entries
    if (this.userBehaviorLog.length > 100) {
      this.userBehaviorLog.shift();
    }

    // Analyze patterns for suggestions
    this.analyzeUserPatterns();
  }

  private analyzeUserPatterns(): void {
    // Analyze recent behavior for suggestions
    const recentActions = this.userBehaviorLog.slice(-10);
    
    // Example: If user frequently logs notes after calls, suggest automation
    const callFollowedByNotes = recentActions.filter((action, index) => {
      if (index === 0) return false;
      const prevAction = recentActions[index - 1];
      return prevAction.action === 'call_ended' && action.action === 'add_note';
    });

    if (callFollowedByNotes.length >= 3) {
      this.suggestAutomation('call_note_automation');
    }
  }

  private suggestAutomation(type: string): void {
    // This would trigger a suggestion in the UI
    logger.info('Suggesting automation:', type);
  }

  private getCurrentWorkspace(): string {
    const path = window.location.pathname;
    if (path.includes('/dialer')) return 'dialer';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/leads')) return 'leads';
    if (path.includes('/tasks')) return 'tasks';
    return 'dashboard';
  }

  // Settings management
  setAlwaysListening(enabled: boolean): void {
    this.isAlwaysListening = enabled;
    if (enabled) {
      this.initializeAlwaysListening();
    } else {
      this.stopListening();
    }
  }

  setLearningMode(enabled: boolean): void {
    this.learningMode = enabled;
  }

  getListeningStatus(): boolean {
    return this.isListening;
  }

  getWakeWords(): string[] {
    return [...this.wakeWords];
  }

  getUserBehaviorLog(): Array<{action: string; context: string; timestamp: Date; workspace: string}> {
    return [...this.userBehaviorLog];
  }
}

export const assistantVoiceService = AssistantVoiceService.getInstance();
