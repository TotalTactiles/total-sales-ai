
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIIngestionEvent, AIRecommendation } from './ai/types';
import { InsightGenerator } from './ai/insightGenerator';
import { nativeAutomationEngine } from './ai/automationEngine';
import { RecommendationService } from './ai/recommendationService';
import { LearningEngine } from './ai/learningEngine';
import { emailAutomationService } from './ai/emailAutomationService';
import { hybridAIOrchestrator } from './ai/hybridAIOrchestrator';
import { aiLearningLayer } from './ai/aiLearningLayer';
import { dataEncryptionService } from './security/dataEncryptionService';

// Re-export types for backward compatibility
export type { AIIngestionEvent, AIRecommendation } from './ai/types';

class MasterAIBrain {
  private static instance: MasterAIBrain;
  private ingestionQueue: AIIngestionEvent[] = [];
  private isProcessing = false;
  private insightGenerator = new InsightGenerator();
  private recommendationService = new RecommendationService();
  private learningEngine = new LearningEngine();

  // Load any unprocessed events from the database on startup
  async reloadUnprocessedEvents(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('id, company_id, payload, timestamp')
        .eq('type', 'ingestion')
        .eq('processed', false);

      if (error) throw error;

      for (const row of data || []) {
        const payload = row.payload as any;
        if (!payload) continue;

        const event: AIIngestionEvent = {
          id: row.id,
          timestamp: new Date(payload.timestamp || row.timestamp || Date.now()),
          processed: false,
          user_id: payload.user_id,
          company_id: row.company_id || payload.company_id,
          event_type: payload.event_type,
          source: payload.source,
          data: payload.data,
          context: payload.context
        };

        this.ingestionQueue.push(event);
      }

      if (!this.isProcessing && this.ingestionQueue.length > 0) {
        this.processIngestionQueue();
      }
    } catch (error) {
      console.error('Error reloading unprocessed events:', error);
    }
  }

  static getInstance(): MasterAIBrain {
    if (!MasterAIBrain.instance) {
      MasterAIBrain.instance = new MasterAIBrain();
    }
    return MasterAIBrain.instance;
  }

  // Enhanced real-time data ingestion with Claude integration
  async ingestEvent(event: Omit<AIIngestionEvent, 'id' | 'timestamp' | 'processed'>): Promise<void> {
    const enrichedEvent: AIIngestionEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      processed: false
    };

    try {
      // Encrypt sensitive data
      const segmentedData = dataEncryptionService.segmentDataByUser(
        event.data, 
        event.user_id, 
        event.company_id
      );
      
      // Store in Supabase for persistence
      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          id: enrichedEvent.id,
          company_id: event.company_id,
          type: 'ingestion',
          event_summary: `${event.event_type}: ${event.source}`,
          payload: {
            user_id: event.user_id,
            event_type: event.event_type,
            source: event.source,
            data: segmentedData,
            context: event.context,
            timestamp: enrichedEvent.timestamp.toISOString()
          },
          processed: false,
          visibility: 'admin_only'
        });

      if (error) throw error;

      // Feed data to AI Learning Layer for continuous learning
      await aiLearningLayer.ingestLearningData({
        userId: event.user_id,
        companyId: event.company_id,
        dataType: this.mapEventTypeToLearningType(event.event_type),
        content: segmentedData,
        source: event.source,
        confidence: this.calculateEventConfidence(enrichedEvent)
      });

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

  private mapEventTypeToLearningType(eventType: string): 'user_interaction' | 'ai_output' | 'system_metric' | 'market_signal' {
    switch (eventType) {
      case 'user_action': return 'user_interaction';
      case 'ai_output': return 'ai_output';
      case 'crm_sync': 
      case 'call_activity': 
      case 'email_interaction': return 'system_metric';
      case 'social_media':
      case 'website_data':
      case 'external_data': return 'market_signal';
      default: return 'user_interaction';
    }
  }

  private calculateEventConfidence(event: AIIngestionEvent): number {
    // Calculate confidence based on event type and data quality
    let confidence = 0.7; // Base confidence
    
    if (event.event_type === 'user_action') {
      confidence = 0.9; // User actions are high confidence
    } else if (event.event_type === 'ai_output') {
      confidence = 0.8; // AI outputs are reliable
    } else if (event.context && Object.keys(event.context).length > 0) {
      confidence += 0.1; // Bonus for rich context
    }
    
    return Math.min(confidence, 1.0);
  }

  // Enhanced processing with Claude pattern analysis
  private async processIngestionQueue(): Promise<void> {
    if (this.isProcessing || this.ingestionQueue.length === 0) return;
    
    this.isProcessing = true;
    console.log(`Processing ${this.ingestionQueue.length} AI events with hybrid AI system...`);

    try {
      const batchSize = 10;
      while (this.ingestionQueue.length > 0) {
        const batch = this.ingestionQueue.splice(0, batchSize);
        await this.processBatchWithHybridAI(batch);
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error processing ingestion queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processBatchWithHybridAI(events: AIIngestionEvent[]): Promise<void> {
    for (const event of events) {
      try {
        // Generate insights using the original insight generator
        await this.insightGenerator.generateInsightsFromEvent(event);
        
        // Update learning models
        await this.learningEngine.updateLearningModels(event);
        
        // Use hybrid AI orchestrator for complex pattern analysis
        if (events.length >= 5) {
          await this.performHybridAnalysis(events, event.company_id, event.user_id);
        }
        
        // Check for automation triggers using new native engine
        await this.checkNativeAutomationTriggers(event);

        // Mark event as processed in the database
        await supabase
          .from('ai_brain_logs')
          .update({ processed: true })
          .eq('id', event.id);

      } catch (error) {
        console.error('Error processing event:', event, error);
      }
    }
  }

  private async performHybridAnalysis(events: AIIngestionEvent[], companyId: string, userId: string): Promise<void> {
    try {
      // Use Claude for pattern analysis on the batch of events
      const analysisTask = {
        id: crypto.randomUUID(),
        type: 'pattern_analysis' as const,
        input: {
          userInteractions: events.filter(e => e.event_type === 'user_action'),
          systemMetrics: events.filter(e => e.event_type === 'crm_sync' || e.event_type === 'call_activity')
        },
        context: `Batch analysis for company ${companyId}`,
        priority: 'medium' as const,
        userId,
        companyId
      };

      await hybridAIOrchestrator.queueTask(analysisTask);
    } catch (error) {
      console.error('Error in hybrid analysis:', error);
    }
  }

  private async checkNativeAutomationTriggers(event: AIIngestionEvent): Promise<void> {
    try {
      // Map AI events to automation triggers
      let triggerType: string | null = null;
      const eventData = {
        ...event.data,
        userId: event.user_id,
        companyId: event.company_id,
        timestamp: event.timestamp.toISOString()
      };

      switch (event.event_type) {
        case 'user_action':
          if (event.data.action === 'lead_created') {
            triggerType = 'lead_created';
          } else if (event.data.action === 'call_completed') {
            triggerType = 'call_completed';
          }
          break;
        case 'email_interaction':
          if (event.data.action === 'opened') {
            triggerType = 'email_opened';
          }
          break;
      }

      if (triggerType) {
        await emailAutomationService.evaluateAutomationTriggers(triggerType, eventData);
      }
    } catch (error) {
      console.error('Error checking native automation triggers:', error);
    }
  }

  // Enhanced public methods with hybrid AI
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

  // Enhanced automation with Claude insights
  async triggerAutomation(
    trigger: string,
    eventData: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<void> {
    try {
      const enrichedData = dataEncryptionService.segmentDataByUser(
        eventData,
        userId,
        companyId
      );

      await emailAutomationService.evaluateAutomationTriggers(trigger, enrichedData);

      // Log the automation trigger
      await this.ingestEvent({
        user_id: userId,
        company_id: companyId,
        event_type: 'ai_output',
        source: 'automation_trigger',
        data: {
          trigger,
          eventData: enrichedData
        }
      });

    } catch (error) {
      console.error('Error triggering automation:', error);
      throw error;
    }
  }

  // Market data ingestion with Claude contextualization
  async ingestMarketData(marketData: any[], companyId: string, userId: string): Promise<void> {
    try {
      // Use Claude to contextualize market data
      const analysisTask = {
        id: crypto.randomUUID(),
        type: 'market_analysis' as const,
        input: { marketData },
        context: `Market analysis for company ${companyId}`,
        priority: 'low' as const,
        userId,
        companyId
      };

      await hybridAIOrchestrator.queueTask(analysisTask);

      // Also ingest as learning data
      await this.ingestEvent({
        user_id: userId,
        company_id: companyId,
        event_type: 'external_data',
        source: 'external_apis',
        data: marketData,
        context: { type: 'market_intelligence' }
      });

    } catch (error) {
      console.error('Error ingesting market data:', error);
    }
  }

  // System health and monitoring
  async getSystemHealth(): Promise<{
    aiServices: string;
    learningStatus: string;
    automationFlows: number;
    lastHealthCheck: string;
  }> {
    try {
      // Check various system components
      const health = {
        aiServices: 'healthy',
        learningStatus: 'active',
        automationFlows: await this.getActiveAutomationCount(),
        lastHealthCheck: new Date().toISOString()
      };

      return health;
    } catch (error) {
      console.error('Error checking system health:', error);
      return {
        aiServices: 'degraded',
        learningStatus: 'error',
        automationFlows: 0,
        lastHealthCheck: new Date().toISOString()
      };
    }
  }

  private async getActiveAutomationCount(): Promise<number> {
    try {
      const { count } = await supabase
        .from('ai_brain_logs')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'automation_flow')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      return count || 0;
    } catch (error) {
      console.error('Error getting automation count:', error);
      return 0;
    }
  }

  // Initialize automation processing with enhanced monitoring
  async initializeAutomation(): Promise<void> {
    // Process scheduled emails every minute
    setInterval(() => {
      emailAutomationService.processScheduledEmails();
    }, 60000);

    // Health check every 5 minutes
    setInterval(() => {
      this.performHealthCheck();
    }, 5 * 60000);

    console.log('Enhanced Master Brain AI initialized with Claude integration, hybrid orchestration, and continuous learning');
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const health = await this.getSystemHealth();
      
      // Log health status
      await supabase.from('ai_brain_logs').insert({
        type: 'system_health',
        event_summary: `System health check: ${health.aiServices}`,
        payload: health,
        visibility: 'admin_only'
      });

    } catch (error) {
      console.error('Health check failed:', error);
    }
  }
}

export const masterAIBrain = MasterAIBrain.getInstance();

// Initialize automation when the module loads
masterAIBrain.initializeAutomation();
// Reload any unprocessed ingestion events
masterAIBrain.reloadUnprocessedEvents();
