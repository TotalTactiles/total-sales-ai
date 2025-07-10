
import { BaseAIModule, ModuleConfig, ProcessingContext, ModuleResponse } from '../core/BaseAIModule';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface CallSession {
  leadId: string;
  callId: string;
  startTime: Date;
  transcription: string[];
  summary?: string;
  actionItems?: string[];
}

export class DialerAI extends BaseAIModule {
  private activeCallSession: CallSession | null = null;
  private preCallTimer: NodeJS.Timeout | null = null;
  private transcriptionBuffer: string[] = [];

  constructor(config: ModuleConfig) {
    super(config);
  }

  protected async initializeModule(): Promise<void> {
    logger.info('Initializing Dialer AI module');
    
    // Initialize speech recognition if available
    if (typeof window !== 'undefined' && 'speechRecognition' in window) {
      this.initializeSpeechRecognition();
    }
    
    logger.info('Dialer AI module initialized');
  }

  protected async processRequest(input: any, context: ProcessingContext): Promise<any> {
    try {
      const requestType = this.determineRequestType(input, context);
      
      switch (requestType) {
        case 'start_call':
          return await this.startCall(input, context);
        case 'end_call':
          return await this.endCall(input, context);
        case 'pre_call_brief':
          return await this.generatePreCallBrief(input, context);
        case 'post_call_summary':
          return await this.generatePostCallSummary(input, context);
        case 'real_time_transcription':
          return await this.processTranscription(input, context);
        case 'call_coaching':
          return await this.provideCallCoaching(input, context);
        default:
          return await this.handleGeneralQuery(input, context);
      }
    } catch (error) {
      logger.error('Error processing Dialer AI request:', error);
      throw error;
    }
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if we can access call logs
      const { error } = await supabase
        .from('call_logs')
        .select('id')
        .eq('company_id', this.config.companyId)
        .limit(1);
      
      return !error;
    } catch (error) {
      logger.error('Dialer AI health check failed:', error);
      return false;
    }
  }

  protected async cleanupModule(): Promise<void> {
    if (this.preCallTimer) {
      clearTimeout(this.preCallTimer);
      this.preCallTimer = null;
    }
    
    if (this.activeCallSession) {
      // Save any pending transcription
      await this.saveCallSession();
    }
    
    this.activeCallSession = null;
    this.transcriptionBuffer = [];
    
    logger.info('Dialer AI module cleaned up');
  }

  // Speech Recognition Setup
  private initializeSpeechRecognition(): void {
    if (typeof window === 'undefined') return;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(' ');
        
        this.handleTranscriptionUpdate(transcript);
      };

      recognition.onerror = (event: any) => {
        logger.error('Speech recognition error:', event.error);
      };

      // Store recognition instance for later use
      (this as any).speechRecognition = recognition;
    } catch (error) {
      logger.error('Failed to initialize speech recognition:', error);
    }
  }

  // Request Processing Methods
  private determineRequestType(input: any, context: ProcessingContext): string {
    const inputStr = String(input).toLowerCase();
    
    if (inputStr.includes('start call') || inputStr.includes('begin call')) {
      return 'start_call';
    }
    if (inputStr.includes('end call') || inputStr.includes('finish call')) {
      return 'end_call';  
    }
    if (inputStr.includes('pre-call') || inputStr.includes('brief') || inputStr.includes('preparation')) {
      return 'pre_call_brief';
    }
    if (inputStr.includes('summary') || inputStr.includes('post-call')) {
      return 'post_call_summary';
    }
    if (inputStr.includes('transcription') || inputStr.includes('transcript')) {
      return 'real_time_transcription';
    }
    if (inputStr.includes('coaching') || inputStr.includes('tips') || inputStr.includes('suggestions')) {
      return 'call_coaching';
    }
    
    return 'general_query';
  }

  private async startCall(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { leadId, callId } = input;
      
      if (!leadId) {
        return {
          success: false,
          error: 'Lead ID required to start call'
        };
      }

      // Create new call session
      this.activeCallSession = {
        leadId,
        callId: callId || crypto.randomUUID(),
        startTime: new Date(),
        transcription: []
      };

      // Generate pre-call brief
      const brief = await this.generatePreCallBrief({ leadId }, context);
      
      // Start speech recognition if available
      if ((this as any).speechRecognition) {
        (this as any).speechRecognition.start();
      }

      // Set 5-minute pre-call timer
      this.preCallTimer = setTimeout(() => {
        logger.info('Pre-call preparation time expired');
      }, 5 * 60 * 1000);

      // Log call start
      await this.logCallEvent('call_started', {
        leadId,
        callId: this.activeCallSession.callId,
        startTime: this.activeCallSession.startTime
      });

      return {
        success: true,
        data: {
          message: 'Call session started',
          callId: this.activeCallSession.callId,
          preCallBrief: brief.data,
          sessionActive: true
        }
      };

    } catch (error) {
      logger.error('Error starting call:', error);
      return {
        success: false,
        error: 'Failed to start call session'
      };
    }
  }

  private async endCall(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    if (!this.activeCallSession) {
      return {
        success: false,
        error: 'No active call session'
      };
    }

    try {
      // Stop speech recognition
      if ((this as any).speechRecognition) {
        (this as any).speechRecognition.stop();
      }

      // Clear pre-call timer
      if (this.preCallTimer) {
        clearTimeout(this.preCallTimer);
        this.preCallTimer = null;
      }

      // Generate post-call summary
      const summary = await this.generatePostCallSummary({
        transcription: this.activeCallSession.transcription,
        leadId: this.activeCallSession.leadId
      }, context);

      // Save call session
      await this.saveCallSession();

      const callId = this.activeCallSession.callId;
      const duration = Date.now() - this.activeCallSession.startTime.getTime();

      // Clear active session
      this.activeCallSession = null;
      this.transcriptionBuffer = [];

      return {
        success: true,
        data: {
          message: 'Call session ended',
          callId,
          duration: Math.round(duration / 1000),
          summary: summary.data,
          requiresApproval: true
        },
        suggestions: [
          'Review call summary',
          'Update lead profile',
          'Schedule follow-up',
          'Add action items'
        ]
      };

    } catch (error) {
      logger.error('Error ending call:', error);
      return {
        success: false,
        error: 'Failed to end call session'
      };
    }
  }

  private async generatePreCallBrief(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { leadId } = input;

      // Get lead information
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .eq('company_id', this.config.companyId)
        .single();

      if (leadError || !lead) {
        return {
          success: false,
          error: 'Lead not found'
        };
      }

      // Get call history
      const { data: callHistory } = await supabase
        .from('call_logs')
        .select('*')
        .eq('lead_id', leadId)
        .eq('company_id', this.config.companyId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Generate brief
      const brief = {
        leadInfo: {
          name: lead.name,
          company: lead.company,
          phone: lead.phone,
          email: lead.email,
          source: lead.source,
          score: lead.score,
          priority: lead.priority,
          status: lead.status
        },
        callHistory: callHistory || [],
        talkingPoints: this.generateTalkingPoints(lead),
        objectives: this.generateCallObjectives(lead),
        potentialObjections: this.generatePotentialObjections(lead),
        contextualNotes: this.generateContextualNotes(lead, callHistory || [])
      };

      return {
        success: true,
        data: brief
      };

    } catch (error) {
      logger.error('Error generating pre-call brief:', error);
      return {
        success: false,
        error: 'Failed to generate pre-call brief'
      };
    }
  }

  private async generatePostCallSummary(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { transcription, leadId } = input;

      if (!transcription || !Array.isArray(transcription)) {
        return {
          success: false,
          error: 'No transcription data available'
        };
      }

      // Analyze transcription
      const fullTranscript = transcription.join(' ');
      const analysis = this.analyzeCallTranscription(fullTranscript);

      // Generate summary
      const summary = {
        duration: this.activeCallSession ? 
          Math.round((Date.now() - this.activeCallSession.startTime.getTime()) / 1000) : 0,
        outcome: analysis.outcome,
        keyPoints: analysis.keyPoints,
        actionItems: analysis.actionItems,
        nextSteps: analysis.nextSteps,
        leadUpdates: analysis.suggestedUpdates,
        sentiment: analysis.sentiment,
        transcript: fullTranscript
      };

      return {
        success: true,
        data: summary
      };

    } catch (error) {
      logger.error('Error generating post-call summary:', error);
      return {
        success: false,
        error: 'Failed to generate post-call summary'
      };
    }
  }

  private async processTranscription(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    if (!this.activeCallSession) {
      return {
        success: false,
        error: 'No active call session'
      };
    }

    try {
      const { transcript } = input;
      
      if (transcript) {
        this.activeCallSession.transcription.push(transcript);
        this.transcriptionBuffer.push(transcript);
        
        // Store transcription in session memory
        await this.storeSessionMemory('call_transcription', this.activeCallSession.transcription);
      }

      return {
        success: true,
        data: {
          message: 'Transcription processed',
          totalSegments: this.activeCallSession.transcription.length
        }
      };

    } catch (error) {
      logger.error('Error processing transcription:', error);
      return {
        success: false,
        error: 'Failed to process transcription'
      };
    }
  }

  private async provideCallCoaching(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    if (!this.activeCallSession) {
      return {
        success: false,
        error: 'No active call session'
      };
    }

    try {
      const currentTranscript = this.activeCallSession.transcription.join(' ');
      const coaching = this.analyzeCallForCoaching(currentTranscript);

      return {
        success: true,
        data: {
          coaching,
          realTimeMetrics: {
            talkTime: coaching.talkTimeRatio,
            questionCount: coaching.questionCount,
            sentiment: coaching.sentimentScore
          }
        },
        suggestions: coaching.suggestions
      };

    } catch (error) {
      logger.error('Error providing call coaching:', error);
      return {
        success: false,
        error: 'Failed to provide call coaching'
      };
    }
  }

  private async handleGeneralQuery(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    return {
      success: true,
      data: {
        message: 'I can assist you with call management. What would you like to do?',
        availableFeatures: [
          'Pre-call preparation and briefing',
          'Real-time call transcription',
          'Post-call summary generation',
          'Call coaching and tips',
          'Lead profile integration'
        ]
      }
    };
  }

  // Helper Methods
  private handleTranscriptionUpdate(transcript: string): void {
    if (this.activeCallSession) {
      this.transcriptionBuffer.push(transcript);
      
      // Process buffer every few seconds
      if (this.transcriptionBuffer.length >= 3) {
        const combinedTranscript = this.transcriptionBuffer.join(' ');
        this.activeCallSession.transcription.push(combinedTranscript);
        this.transcriptionBuffer = [];
      }
    }
  }

  private async saveCallSession(): Promise<void> {
    if (!this.activeCallSession) return;

    try {
      const duration = Math.round((Date.now() - this.activeCallSession.startTime.getTime()) / 1000);
      
      await supabase
        .from('call_logs')
        .insert({
          lead_id: this.activeCallSession.leadId,
          company_id: this.config.companyId,
          user_id: this.config.repId,
          call_type: 'outbound',
          duration,
          status: 'completed',
          notes: this.activeCallSession.transcription.join('\n'),
          call_sid: this.activeCallSession.callId
        });

    } catch (error) {
      logger.error('Failed to save call session:', error);
    }
  }

  private async logCallEvent(eventType: string, data: any): Promise<void> {
    try {
      logger.info(`Call event: ${eventType}`, data);
      // Additional logging can be implemented here
    } catch (error) {
      logger.error('Failed to log call event:', error);
    }
  }

  private generateTalkingPoints(lead: any): string[] {
    const points: string[] = [];
    
    if (lead.company) {
      points.push(`Discuss ${lead.company}'s current challenges`);
    }
    
    if (lead.source) {
      points.push(`Reference ${lead.source} as connection point`);
    }
    
    if (lead.priority === 'high') {
      points.push('Prioritize immediate value proposition');
    }
    
    points.push('Understand their decision-making process');
    points.push('Identify pain points and budget');
    
    return points;
  }

  private generateCallObjectives(lead: any): string[] {
    const objectives: string[] = [];
    
    if (lead.status === 'new') {
      objectives.push('Qualify lead requirements');
      objectives.push('Establish rapport and credibility');
    }
    
    if (lead.status === 'qualified') {
      objectives.push('Present solution overview');
      objectives.push('Schedule detailed demo');
    }
    
    objectives.push('Identify decision makers');
    objectives.push('Understand timeline and budget');
    
    return objectives;
  }

  private generatePotentialObjections(lead: any): string[] {
    return [
      'Price/budget concerns',
      'Current solution satisfaction',
      'Implementation complexity',
      'Decision timing',
      'Authority to make decision'
    ];
  }

  private generateContextualNotes(lead: any, callHistory: any[]): string[] {
    const notes: string[] = [];
    
    if (callHistory.length > 0) {
      notes.push(`Previous contact: ${callHistory[0].created_at}`);
      if (callHistory[0].notes) {
        notes.push(`Last call notes: ${callHistory[0].notes.substring(0, 100)}...`);
      }
    } else {
      notes.push('First contact attempt');
    }
    
    if (lead.last_contact) {
      const daysSince = Math.floor((Date.now() - new Date(lead.last_contact).getTime()) / (1000 * 60 * 60 * 24));
      notes.push(`Last contact: ${daysSince} days ago`);
    }
    
    return notes;
  }

  private analyzeCallTranscription(transcript: string): any {
    // Basic analysis - in production would use NLP
    const words = transcript.toLowerCase().split(' ');
    const sentences = transcript.split(/[.!?]+/);
    
    return {
      outcome: this.determineCallOutcome(transcript),
      keyPoints: this.extractKeyPoints(transcript),
      actionItems: this.extractActionItems(transcript),
      nextSteps: this.suggestNextSteps(transcript),
      suggestedUpdates: this.suggestLeadUpdates(transcript),
      sentiment: this.analyzeSentiment(transcript)
    };
  }

  private analyzeCallForCoaching(transcript: string): any {
    const words = transcript.toLowerCase().split(' ');
    const questions = (transcript.match(/\?/g) || []).length;
    
    return {
      talkTimeRatio: this.calculateTalkTimeRatio(transcript),
      questionCount: questions,
      sentimentScore: this.analyzeSentiment(transcript),
      suggestions: this.generateCoachingSuggestions(transcript)
    };
  }

  private determineCallOutcome(transcript: string): string {
    const positive = ['yes', 'interested', 'sounds good', 'let\'s do it'];
    const negative = ['no', 'not interested', 'busy', 'call back'];
    
    const lowerTranscript = transcript.toLowerCase();
    
    if (positive.some(word => lowerTranscript.includes(word))) {
      return 'positive';
    }
    if (negative.some(word => lowerTranscript.includes(word))) {
      return 'negative';
    }
    
    return 'neutral';
  }

  private extractKeyPoints(transcript: string): string[] {
    // Simple keyword extraction - in production would use NLP
    const keywords = ['budget', 'timeline', 'decision', 'team', 'challenge', 'solution'];
    const points: string[] = [];
    
    keywords.forEach(keyword => {
      if (transcript.toLowerCase().includes(keyword)) {
        points.push(`Discussed ${keyword}`);
      }
    });
    
    return points;
  }

  private extractActionItems(transcript: string): string[] {
    const actionWords = ['follow up', 'send', 'schedule', 'call back', 'email'];
    const items: string[] = [];
    
    actionWords.forEach(action => {
      if (transcript.toLowerCase().includes(action)) {
        items.push(`Action: ${action}`);
      }
    });
    
    return items;
  }

  private suggestNextSteps(transcript: string): string[] {
    const outcome = this.determineCallOutcome(transcript);
    
    switch (outcome) {
      case 'positive':
        return ['Schedule follow-up meeting', 'Send proposal', 'Connect with decision makers'];
      case 'negative':
        return ['Add to nurture campaign', 'Schedule follow-up in 3 months', 'Update lead status'];
      default:
        return ['Send summary email', 'Schedule follow-up call', 'Gather additional information'];
    }
  }

  private suggestLeadUpdates(transcript: string): any {
    const updates: any = {};
    
    if (transcript.toLowerCase().includes('budget')) {
      updates.notes = 'Budget discussed during call';
    }
    
    if (transcript.toLowerCase().includes('timeline')) {
      updates.notes = (updates.notes || '') + ' Timeline requirements mentioned';
    }
    
    const outcome = this.determineCallOutcome(transcript);
    if (outcome === 'positive') {
      updates.status = 'interested';
    } else if (outcome === 'negative') {
      updates.status = 'not_interested';
    }
    
    return updates;
  }

  private analyzeSentiment(transcript: string): string {
    // Simple sentiment analysis - in production would use NLP
    const positive = ['great', 'excellent', 'good', 'interested', 'sounds good'];
    const negative = ['bad', 'terrible', 'not interested', 'busy', 'no'];
    
    const lowerTranscript = transcript.toLowerCase();
    
    const positiveCount = positive.filter(word => lowerTranscript.includes(word)).length;
    const negativeCount = negative.filter(word => lowerTranscript.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculateTalkTimeRatio(transcript: string): number {
    // Simplified calculation - in production would analyze actual speech patterns
    return 0.6; // Placeholder value
  }

  private generateCoachingSuggestions(transcript: string): string[] {
    const suggestions: string[] = [];
    
    const questionCount = (transcript.match(/\?/g) || []).length;
    if (questionCount < 3) {
      suggestions.push('Ask more discovery questions');
    }
    
    if (transcript.length < 500) {
      suggestions.push('Engage in longer conversation');
    }
    
    if (!transcript.toLowerCase().includes('challenge')) {
      suggestions.push('Explore customer challenges');
    }
    
    return suggestions;
  }
}
