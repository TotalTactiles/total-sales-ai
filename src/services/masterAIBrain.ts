
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIIngestionEvent, AIRecommendation } from './ai/types';
import { InsightGenerator } from './ai/insightGenerator';
import { AutomationEngine } from './ai/automationEngine';
import { RecommendationService } from './ai/recommendationService';
import { LearningEngine } from './ai/learningEngine';
import { emailAutomationService } from './ai/emailAutomationService';

// Re-export types for backward compatibility
export type { AIIngestionEvent, AIRecommendation } from './ai/types';

class MasterAIBrain {
  private static instance: MasterAIBrain;
  private ingestionQueue: AIIngestionEvent[] = [];
  private isProcessing = false;
  private insightGenerator = new InsightGenerator();
  private automationEngine = new AutomationEngine();
  private recommendationService = new RecommendationService();
  private learningEngine = new LearningEngine();
  private emailAutomationService = emailAutomationService;

  static getInstance(): MasterAIBrain {
    if (!MasterAIBrain.instance) {
      MasterAIBrain.instance = new MasterAIBrain();
    }
    return MasterAIBrain.instance;
  }

  // Real-time data ingestion
  async ingestEvent(event: Omit<AIIngestionEvent, 'id' | 'timestamp' | 'processed'>): Promise<void> {
    const enrichedEvent: AIIngestionEvent = {
      ...event,
      timestamp: new Date(),
      processed: false
    };

    try {
      // Store in Supabase for persistence
      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: event.company_id,
          type: 'ingestion',
          event_summary: `${event.event_type}: ${event.source}`,
          payload: {
            user_id: event.user_id,
            event_type: event.event_type,
            source: event.source,
            data: event.data,
            context: event.context,
            timestamp: enrichedEvent.timestamp.toISOString()
          },
          visibility: 'admin_only'
        });

      if (error) throw error;

      // Add to processing queue
      this.ingestionQueue.push(enrichedEvent);
      
      // Process queue if not already processing
      if (!this.isProcessing) {
        this.processIngestionQueue();
      }

    } catch (error) {
      console.error('Error ingesting AI event:', error);
      toast.error('Failed to ingest AI data');
    }
  }

  // Process ingestion queue in batches
  private async processIngestionQueue(): Promise<void> {
    if (this.isProcessing || this.ingestionQueue.length === 0) return;
    
    this.isProcessing = true;
    console.log(`Processing ${this.ingestionQueue.length} AI events...`);

    try {
      const batchSize = 10;
      while (this.ingestionQueue.length > 0) {
        const batch = this.ingestionQueue.splice(0, batchSize);
        await this.processBatch(batch);
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error processing ingestion queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processBatch(events: AIIngestionEvent[]): Promise<void> {
    for (const event of events) {
      try {
        // Generate insights based on event type
        await this.insightGenerator.generateInsightsFromEvent(event);
        
        // Update learning models
        await this.learningEngine.updateLearningModels(event);
        
        // Check for automation triggers
        await this.automationEngine.checkAutomationTriggers(event);
        
        // Check for email automation triggers
        await this.checkEmailAutomationTriggers(event);
        
      } catch (error) {
        console.error('Error processing event:', event, error);
      }
    }
  }

  private async checkEmailAutomationTriggers(event: AIIngestionEvent): Promise<void> {
    try {
      // Map AI events to email automation triggers
      let trigger: any = null;
      const eventData = {
        ...event.data,
        userId: event.user_id,
        companyId: event.company_id,
        timestamp: event.timestamp.toISOString()
      };

      switch (event.event_type) {
        case 'user_action':
          if (event.data.action === 'lead_created') {
            trigger = 'lead_created';
          } else if (event.data.action === 'call_completed') {
            trigger = 'call_completed';
          }
          break;
        case 'email_interaction':
          if (event.data.action === 'opened') {
            trigger = 'email_opened';
          }
          break;
      }

      if (trigger) {
        await this.emailAutomationService.evaluateAutomationTriggers(trigger, eventData);
      }
    } catch (error) {
      console.error('Error checking email automation triggers:', error);
    }
  }

  // Public methods for AI assistants
  async getPersonalizedRecommendations(userId: string, companyId: string, context: Record<string, any>): Promise<AIRecommendation[]> {
    return this.recommendationService.getPersonalizedRecommendations(userId, companyId, context);
  }

  async logUserFeedback(userId: string, companyId: string, feedback: Record<string, any>): Promise<void> {
    await this.ingestEvent({
      user_id: userId,
      company_id: companyId,
      event_type: 'ai_output',
      source: 'user_feedback',
      data: feedback,
      context: { type: 'feedback_loop' }
    });
  }

  // Email automation methods
  async sendAutomatedEmail(
    to: string,
    templateId: string,
    variables: Record<string, string>,
    delay?: number
  ): Promise<void> {
    try {
      const email = await this.emailAutomationService.generateEmailFromTemplate(
        templateId,
        variables
      );

      const sendAt = delay 
        ? new Date(Date.now() + delay * 60 * 60 * 1000)
        : new Date();

      await this.emailAutomationService.scheduleEmail(
        to,
        email.subject,
        email.body,
        sendAt,
        { templateId, variables }
      );

      // Log the automation
      await this.ingestEvent({
        user_id: variables.userId || 'system',
        company_id: variables.companyId || 'system',
        event_type: 'ai_output',
        source: 'email_automation',
        data: {
          action: 'automated_email_scheduled',
          to,
          templateId,
          sendAt: sendAt.toISOString()
        }
      });

    } catch (error) {
      console.error('Error sending automated email:', error);
      throw error;
    }
  }

  // Initialize email automation processing
  async initializeEmailAutomation(): Promise<void> {
    // Process scheduled emails every minute
    setInterval(() => {
      this.emailAutomationService.processScheduledEmails();
    }, 60000);

    console.log('Email automation system initialized');
  }
}

export const masterAIBrain = MasterAIBrain.getInstance();

// Initialize email automation when the module loads
masterAIBrain.initializeEmailAutomation();
