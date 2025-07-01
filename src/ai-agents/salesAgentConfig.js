import { relevanceAgentService } from '@/services/relevance/RelevanceAgentService';
import { TriggerHandlers } from '@/automations/native/triggerHandlers';
import { logger } from '@/utils/logger';

export class SalesAgentConfig {
  static async initializeAgent(userId, companyId) {
    try {
      logger.info('Initializing Sales AI Agent', { userId, companyId }, 'ai_agent');
      
      // Set up agent memory and context
      await this.setupAgentMemory(userId, companyId);
      
      return { success: true, message: 'Sales Agent initialized' };
    } catch (error) {
      logger.error('Failed to initialize Sales Agent', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async triggerLeadAutomation({ leadId, automationType, context, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeSalesAgent(
        'lead_automation',
        {
          leadId,
          automationType,
          context,
          personalizedApproach: true,
          aiGenerated: true
        },
        userId,
        companyId
      );

      if (result.success) {
        // Execute the automation based on type
        switch (automationType) {
          case 'tag_trigger':
            return await TriggerHandlers.handleLeadTagTrigger({
              leadId,
              tag: context.tag,
              leadData: context.leadData,
              userId,
              companyId
            });
          case 'nurture_sequence':
            return await this.startPersonalizedNurture(leadId, context, userId, companyId);
          case 'follow_up':
            return await this.scheduleIntelligentFollowUp(leadId, context, userId, companyId);
          default:
            throw new Error(`Unknown automation type: ${automationType}`);
        }
      }

      return result;
    } catch (error) {
      logger.error('Sales Agent automation trigger failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async generatePersonalizedEmail({ leadId, context, emailType, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeSalesAgent(
        'personalized_email',
        {
          leadId,
          context,
          emailType,
          includePersonalization: true,
          brandVoice: context.brandVoice || 'professional',
          callToAction: context.callToAction
        },
        userId,
        companyId
      );

      if (result.success && result.output.emailContent) {
        // Send the generated email
        const { emailSequences } = await import('@/automations/native/emailSequences.js');
        
        return await emailSequences.sendTemplatedEmail({
          leadId,
          template: {
            subject: result.output.subject,
            content: result.output.emailContent,
            id: 'ai_generated'
          },
          leadData: context.leadData,
          userId,
          companyId
        });
      }

      return result;
    } catch (error) {
      logger.error('Sales Agent email generation failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async analyzeLeadBehavior({ leadId, interactionHistory, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeSalesAgent(
        'behavior_analysis',
        {
          leadId,
          interactionHistory,
          analysisDepth: 'comprehensive',
          includeRecommendations: true,
          predictiveInsights: true
        },
        userId,
        companyId
      );

      if (result.success) {
        // Update lead with AI insights
        await this.updateLeadWithInsights(leadId, result.output, userId, companyId);
      }

      return result;
    } catch (error) {
      logger.error('Sales Agent behavior analysis failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async optimizeCallTiming({ leadId, leadData, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeSalesAgent(
        'call_timing_optimization',
        {
          leadId,
          leadData,
          timeZone: leadData.timezone,
          industryPatterns: true,
          behaviorPatterns: true,
          historicalData: true
        },
        userId,
        companyId
      );

      if (result.success && result.output.optimalTimes) {
        // Schedule calls at optimal times
        await this.scheduleOptimalCalls(leadId, result.output.optimalTimes, userId, companyId);
      }

      return result;
    } catch (error) {
      logger.error('Sales Agent call timing optimization failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async predictLeadConversion({ leadId, leadData, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeSalesAgent(
        'conversion_prediction',
        {
          leadId,
          leadData,
          includeConfidenceScore: true,
          includeRecommendations: true,
          timeFramePrediction: '30_days'
        },
        userId,
        companyId
      );

      if (result.success) {
        // Update lead with conversion predictions
        await this.updateConversionPredictions(leadId, result.output, userId, companyId);
      }

      return result;
    } catch (error) {
      logger.error('Sales Agent conversion prediction failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async setupAgentMemory(userId, companyId) {
    const memoryData = {
      user_preferences: await this.getUserPreferences(userId),
      company_context: await this.getCompanyContext(companyId),
      performance_metrics: await this.getPerformanceMetrics(userId, companyId),
      learning_patterns: await this.getLearningPatterns(userId, companyId)
    };

    await relevanceAgentService.updateSalesAgentMemory(
      `user_${userId}`,
      memoryData
    );
  }

  static async startPersonalizedNurture(leadId, context, userId, companyId) {
    const { emailSequences } = await import('@/automations/native/emailSequences.js');
    
    // AI determines the best nurture sequence based on lead profile
    const sequenceType = this.determineOptimalSequence(context.leadData);
    
    return await emailSequences.startNurtureSequence({
      leadId,
      leadData: context.leadData,
      sequenceType,
      userId,
      companyId
    });
  }

  static async scheduleIntelligentFollowUp(leadId, context, userId, companyId) {
    const { scheduler } = await import('@/utils/scheduler.js');
    
    // AI determines optimal follow-up timing
    const optimalDelay = this.calculateOptimalDelay(context.leadData, context.lastInteraction);
    
    return await scheduler.scheduleTask({
      taskType: 'lead_followup',
      delay: optimalDelay,
      data: { 
        leadId, 
        tag: context.leadData.status || 'follow_up',
        aiGenerated: true 
      },
      userId,
      companyId
    });
  }

  static determineOptimalSequence(leadData) {
    // AI logic to determine best sequence
    if (leadData.industry === 'technology') return 'tech_focused_nurture';
    if (leadData.company_size === 'enterprise') return 'enterprise_nurture';
    if (leadData.stage === 'awareness') return 'educational_nurture';
    return 'standard_nurture';
  }

  static calculateOptimalDelay(leadData, lastInteraction) {
    // AI logic for optimal timing
    const baseDelay = 24 * 60 * 60 * 1000; // 24 hours
    const urgencyMultiplier = leadData.urgency === 'high' ? 0.5 : 1;
    const engagementMultiplier = leadData.engagement_score > 70 ? 0.8 : 1.2;
    
    return baseDelay * urgencyMultiplier * engagementMultiplier;
  }

  static async updateLeadWithInsights(leadId, insights, userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    await supabase
      .from('leads')
      .update({
        ai_insights: insights,
        behavior_score: insights.behaviorScore,
        engagement_prediction: insights.engagementPrediction,
        recommended_actions: insights.recommendedActions,
        last_ai_analysis: new Date().toISOString()
      })
      .eq('id', leadId);
  }

  static async updateConversionPredictions(leadId, predictions, userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    await supabase
      .from('leads')
      .update({
        conversion_probability: predictions.probability,
        conversion_confidence: predictions.confidence,
        predicted_close_date: predictions.predictedCloseDate,
        conversion_factors: predictions.factors,
        last_prediction_update: new Date().toISOString()
      })
      .eq('id', leadId);
  }

  static async scheduleOptimalCalls(leadId, optimalTimes, userId, companyId) {
    const { scheduler } = await import('@/utils/scheduler.js');
    
    for (const timeSlot of optimalTimes) {
      await scheduler.scheduleTask({
        taskType: 'sales_call',
        delay: new Date(timeSlot.datetime) - new Date(),
        data: { 
          leadId, 
          reason: 'ai_optimized_timing',
          confidence: timeSlot.confidence 
        },
        userId,
        companyId
      });
    }
  }

  static async getUserPreferences(userId) {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return data || {};
  }

  static async getCompanyContext(companyId) {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
    
    return data || {};
  }

  static async getPerformanceMetrics(userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data } = await supabase
      .from('user_performance_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    return data || [];
  }

  static async getLearningPatterns(userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data } = await supabase
      .from('ai_learning_patterns')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    return data || [];
  }
}

export const salesAgentConfig = SalesAgentConfig;
