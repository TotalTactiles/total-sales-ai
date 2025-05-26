import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIIngestionEvent {
  id?: string;
  user_id: string;
  company_id: string;
  event_type: 'user_action' | 'crm_sync' | 'email_interaction' | 'call_activity' | 'social_media' | 'website_data' | 'ai_output' | 'external_data';
  source: string;
  data: Record<string, any>;
  context?: Record<string, any>;
  timestamp: Date;
  processed: boolean;
}

export interface AIInsight {
  id: string;
  type: 'performance' | 'recommendation' | 'optimization' | 'alert' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  metadata: Record<string, any>;
  user_id?: string;
  company_id: string;
  timestamp: Date;
}

export interface AIRecommendation {
  id: string;
  type: 'lead_action' | 'timing' | 'content' | 'automation' | 'coaching' | 'strategy';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  suggested_action: string;
  context: Record<string, any>;
  confidence: number;
  expires_at?: Date;
  user_id: string;
  company_id: string;
  accepted?: boolean;
  executed?: boolean;
  timestamp: Date;
}

// Type guard to check if context is a valid object
const isValidContext = (context: any): context is Record<string, any> => {
  return context && typeof context === 'object' && !Array.isArray(context);
};

class MasterAIBrain {
  private static instance: MasterAIBrain;
  private ingestionQueue: AIIngestionEvent[] = [];
  private isProcessing = false;

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
        await this.generateInsightsFromEvent(event);
        
        // Update learning models
        await this.updateLearningModels(event);
        
        // Check for automation triggers
        await this.checkAutomationTriggers(event);
        
      } catch (error) {
        console.error('Error processing event:', event, error);
      }
    }
  }

  private async generateInsightsFromEvent(event: AIIngestionEvent): Promise<void> {
    // AI-powered insight generation based on event patterns
    const insights: Partial<AIInsight>[] = [];

    switch (event.event_type) {
      case 'user_action':
        if (event.data.action === 'call_completed' && event.data.outcome === 'no_answer') {
          const callHistory = await this.getRecentCallHistory(event.user_id);
          if (callHistory.filter(c => c.outcome === 'no_answer').length >= 3) {
            insights.push({
              type: 'recommendation',
              title: 'Call Timing Optimization',
              description: 'Consider adjusting call times - detected pattern of no-answers',
              confidence: 0.75,
              impact: 'medium',
              actionable: true,
              metadata: { suggested_times: ['10:00 AM', '2:00 PM', '4:00 PM'] }
            });
          }
        }
        break;

      case 'email_interaction':
        if (event.data.action === 'opened' && event.data.subject?.includes('follow-up')) {
          insights.push({
            type: 'trend',
            title: 'Follow-up Email Engagement',
            description: 'Follow-up emails showing high engagement rates',
            confidence: 0.85,
            impact: 'medium',
            actionable: true,
            metadata: { engagement_rate: event.data.engagement_rate }
          });
        }
        break;
    }

    // Store insights
    for (const insight of insights) {
      await this.storeInsight({
        ...insight,
        id: crypto.randomUUID(),
        company_id: event.company_id,
        user_id: event.user_id,
        timestamp: new Date()
      } as AIInsight);
    }
  }

  private async updateLearningModels(event: AIIngestionEvent): Promise<void> {
    // Update AI learning models based on event data
    try {
      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: event.company_id,
          type: 'learning_update',
          event_summary: 'Model learning update',
          payload: {
            event_type: event.event_type,
            learning_data: event.data,
            timestamp: new Date().toISOString()
          },
          visibility: 'admin_only'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating learning models:', error);
    }
  }

  private async checkAutomationTriggers(event: AIIngestionEvent): Promise<void> {
    // Check if event triggers any automated actions
    const triggers = await this.getAutomationTriggers(event.company_id);
    
    for (const trigger of triggers) {
      if (this.eventMatchesTrigger(event, trigger)) {
        await this.executeAutomation(trigger, event);
      }
    }
  }

  private async getRecentCallHistory(userId: string): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      return data || [];
    } catch (error) {
      console.error('Error fetching call history:', error);
      return [];
    }
  }

  private async storeInsight(insight: AIInsight): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_brain_insights')
        .insert({
          type: insight.type,
          company_id: insight.company_id,
          user_id: insight.user_id,
          context: {
            title: insight.title,
            description: insight.description,
            confidence: insight.confidence,
            impact: insight.impact,
            actionable: insight.actionable,
            metadata: insight.metadata
          },
          triggered_by: 'master_ai_brain'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing insight:', error);
    }
  }

  private async getAutomationTriggers(companyId: string): Promise<any[]> {
    // Fetch automation triggers for the company
    try {
      const { data } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('company_id', companyId)
        .eq('type', 'automation_trigger')
        .order('timestamp', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error fetching automation triggers:', error);
      return [];
    }
  }

  private eventMatchesTrigger(event: AIIngestionEvent, trigger: any): boolean {
    // Simple trigger matching logic - can be enhanced
    return trigger.payload?.event_type === event.event_type;
  }

  private async executeAutomation(trigger: any, event: AIIngestionEvent): Promise<void> {
    console.log('Executing automation:', trigger.id, 'for event:', event.id);
    
    // Log automation execution
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: event.company_id,
          type: 'automation_executed',
          event_summary: `Automation executed: ${trigger.id}`,
          payload: {
            trigger_id: trigger.id,
            event_id: event.id,
            timestamp: new Date().toISOString()
          },
          visibility: 'admin_only'
        });
    } catch (error) {
      console.error('Error logging automation execution:', error);
    }
  }

  // Public methods for AI assistants
  async getPersonalizedRecommendations(userId: string, companyId: string, context: Record<string, any>): Promise<AIRecommendation[]> {
    try {
      // Generate contextual recommendations based on user data and AI brain insights
      const { data: insights } = await supabase
        .from('ai_brain_insights')
        .select('*')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(10);

      const recommendations: AIRecommendation[] = [];

      // Convert insights to actionable recommendations
      for (const insight of insights || []) {
        const insightContext = isValidContext(insight.context) ? insight.context : {};
        
        if (insightContext.actionable) {
          recommendations.push({
            id: crypto.randomUUID(),
            type: this.mapInsightToRecommendationType(insight.type),
            priority: this.mapImpactToPriority(insightContext.impact),
            title: insightContext.title || 'AI Recommendation',
            description: insightContext.description || 'AI-generated recommendation',
            suggested_action: this.generateSuggestedAction(insight),
            context: insightContext,
            confidence: insightContext.confidence || 0.5,
            user_id: userId,
            company_id: companyId,
            timestamp: new Date()
          });
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  private mapInsightToRecommendationType(insightType: string): AIRecommendation['type'] {
    const mapping: Record<string, AIRecommendation['type']> = {
      'performance': 'coaching',
      'recommendation': 'lead_action',
      'optimization': 'automation',
      'alert': 'strategy',
      'trend': 'timing'
    };
    return mapping[insightType] || 'strategy';
  }

  private mapImpactToPriority(impact: string): AIRecommendation['priority'] {
    const mapping: Record<string, AIRecommendation['priority']> = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'urgent'
    };
    return mapping[impact] || 'medium';
  }

  private generateSuggestedAction(insight: any): string {
    const insightContext = isValidContext(insight.context) ? insight.context : {};
    
    // Generate contextual action suggestions based on insight type and metadata
    switch (insight.type) {
      case 'recommendation':
        return `Take action based on: ${insightContext.description || 'AI recommendation'}`;
      case 'optimization':
        return `Optimize workflow: ${insightContext.title || 'Process optimization'}`;
      case 'alert':
        return `Address alert: ${insightContext.description || 'System alert'}`;
      default:
        return `Review and consider: ${insightContext.title || 'AI insight'}`;
    }
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
}

export const masterAIBrain = MasterAIBrain.getInstance();
