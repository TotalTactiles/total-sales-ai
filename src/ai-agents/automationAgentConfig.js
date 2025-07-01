
import { relevanceAgentService } from '@/services/relevance/RelevanceAgentService';
import { executionManager } from '@/services/ai/automation/executionManager';
import { TriggerHandlers } from '@/automations/native/triggerHandlers';
import { logger } from '@/utils/logger';

export class AutomationAgentConfig {
  static async initializeAgent(userId, companyId) {
    try {
      logger.info('Initializing Automation AI Agent', { userId, companyId }, 'ai_agent');
      
      // Set up automation monitoring
      await this.setupAutomationMonitoring(userId, companyId);
      
      return { success: true, message: 'Automation Agent initialized' };
    } catch (error) {
      logger.error('Failed to initialize Automation Agent', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async analyzeAndOptimizeWorkflows({ workflowData, performanceMetrics, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeAutomationAgent(
        'workflow_optimization',
        {
          workflowData,
          performanceMetrics,
          analysisType: 'comprehensive',
          includeRecommendations: true,
          optimizationGoals: ['efficiency', 'conversion', 'engagement']
        },
        userId,
        companyId
      );

      if (result.success && result.output.optimizations) {
        // Apply AI-recommended optimizations
        await this.applyWorkflowOptimizations(result.output.optimizations, userId, companyId);
      }

      return result;
    } catch (error) {
      logger.error('Automation Agent workflow optimization failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async handleAutomationFailure({ failureData, context, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeAutomationAgent(
        'failure_recovery',
        {
          failureData,
          context,
          recoveryStrategy: 'intelligent',
          preventFutureFailures: true,
          silentFailover: true
        },
        userId,
        companyId
      );

      if (result.success) {
        // Execute recovery actions
        await this.executeRecoveryActions(result.output, userId, companyId);
      }

      return result;
    } catch (error) {
      logger.error('Automation Agent failure recovery failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async predictAutomationNeeds({ leadData, userBehavior, industryTrends, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeAutomationAgent(
        'automation_prediction',
        {
          leadData,
          userBehavior,
          industryTrends,
          predictionHorizon: '30_days',
          includeConfidence: true,
          suggestNewAutomations: true
        },
        userId,
        companyId
      );

      if (result.success && result.output.recommendations) {
        // Create recommended automations
        await this.createRecommendedAutomations(result.output.recommendations, userId, companyId);
      }

      return result;
    } catch (error) {
      logger.error('Automation Agent prediction failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async manageCrossChannelSequences({ leadId, channels, context, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeAutomationAgent(
        'cross_channel_sequencing',
        {
          leadId,
          channels,
          context,
          sequenceType: 'intelligent',
          coordinateChannels: true,
          optimizeTiming: true
        },
        userId,
        companyId
      );

      if (result.success) {
        // Execute cross-channel sequence
        await this.executeCrossChannelSequence(leadId, result.output, userId, companyId);
      }

      return result;
    } catch (error) {
      logger.error('Automation Agent cross-channel sequencing failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async monitorAndAdjustAutomations({ automationId, performanceData, userId, companyId }) {
    try {
      const result = await relevanceAgentService.executeAutomationAgent(
        'performance_monitoring',
        {
          automationId,
          performanceData,
          adjustmentType: 'real_time',
          learningEnabled: true,
          autoOptimize: true
        },
        userId,
        companyId
      );

      if (result.success && result.output.adjustments) {
        // Apply real-time adjustments
        await this.applyRealTimeAdjustments(automationId, result.output.adjustments, userId, companyId);
      }

      return result;
    } catch (error) {
      logger.error('Automation Agent monitoring failed', error, 'ai_agent');
      return { success: false, error: error.message };
    }
  }

  static async setupAutomationMonitoring(userId, companyId) {
    // Set up monitoring for all active automations
    const memoryData = {
      active_automations: await this.getActiveAutomations(userId, companyId),
      performance_benchmarks: await this.getPerformanceBenchmarks(userId, companyId),
      failure_patterns: await this.getFailurePatterns(userId, companyId),
      optimization_history: await this.getOptimizationHistory(userId, companyId)
    };

    await relevanceAgentService.updateAutomationAgentMemory(
      `company_${companyId}`,
      memoryData
    );
  }

  static async applyWorkflowOptimizations(optimizations, userId, companyId) {
    for (const optimization of optimizations) {
      try {
        switch (optimization.type) {
          case 'timing_adjustment':
            await this.adjustWorkflowTiming(optimization, userId, companyId);
            break;
          case 'content_optimization':
            await this.optimizeWorkflowContent(optimization, userId, companyId);
            break;
          case 'channel_rebalancing':
            await this.rebalanceChannels(optimization, userId, companyId);
            break;
          case 'sequence_modification':
            await this.modifySequence(optimization, userId, companyId);
            break;
          default:
            logger.warn(`Unknown optimization type: ${optimization.type}`, {}, 'ai_agent');
        }
      } catch (error) {
        logger.error('Failed to apply optimization', error, 'ai_agent');
      }
    }
  }

  static async executeRecoveryActions(recoveryPlan, userId, companyId) {
    for (const action of recoveryPlan.actions) {
      try {
        switch (action.type) {
          case 'retry_failed_action':
            await this.retryFailedAction(action, userId, companyId);
            break;
          case 'fallback_channel':
            await this.executeFallbackChannel(action, userId, companyId);
            break;
          case 'escalate_to_human':
            await this.escalateToHuman(action, userId, companyId);
            break;
          case 'log_and_skip':
            await this.logAndSkip(action, userId, companyId);
            break;
          default:
            logger.warn(`Unknown recovery action: ${action.type}`, {}, 'ai_agent');
        }
      } catch (error) {
        logger.error('Failed to execute recovery action', error, 'ai_agent');
      }
    }
  }

  static async createRecommendedAutomations(recommendations, userId, companyId) {
    const { workflowService } = await import('@/services/automation/workflowService.js');
    
    for (const recommendation of recommendations) {
      if (recommendation.confidence > 0.8) {
        try {
          await workflowService.createWorkflow({
            name: recommendation.name,
            description: recommendation.description,
            isActive: false, // Start as draft for review
            trigger: recommendation.trigger,
            actions: recommendation.actions,
            createdBy: 'ai_agent',
            metadata: {
              aiGenerated: true,
              confidence: recommendation.confidence,
              reasoning: recommendation.reasoning
            }
          });
        } catch (error) {
          logger.error('Failed to create recommended automation', error, 'ai_agent');
        }
      }
    }
  }

  static async executeCrossChannelSequence(leadId, sequencePlan, userId, companyId) {
    const { scheduler } = await import('@/utils/scheduler.js');
    
    for (const step of sequencePlan.steps) {
      await scheduler.scheduleTask({
        taskType: `${step.channel}_automation`,
        delay: step.delay,
        data: {
          leadId,
          action: step.action,
          content: step.content,
          crossChannelSequence: true,
          sequenceId: sequencePlan.id
        },
        userId,
        companyId
      });
    }
  }

  static async applyRealTimeAdjustments(automationId, adjustments, userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    for (const adjustment of adjustments) {
      await supabase
        .from('automation_adjustments')
        .insert({
          automation_id: automationId,
          adjustment_type: adjustment.type,
          previous_value: adjustment.previousValue,
          new_value: adjustment.newValue,
          reason: adjustment.reason,
          confidence: adjustment.confidence,
          applied_at: new Date().toISOString(),
          user_id: userId,
          company_id: companyId
        });
    }
  }

  static async adjustWorkflowTiming(optimization, userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    await supabase
      .from('automation_workflows')
      .update({
        timing_adjustments: optimization.timingChanges,
        last_optimization: new Date().toISOString(),
        optimization_reason: optimization.reason
      })
      .eq('id', optimization.workflowId);
  }

  static async optimizeWorkflowContent(optimization, userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    await supabase
      .from('email_templates')
      .update({
        content: optimization.optimizedContent,
        subject: optimization.optimizedSubject,
        optimization_applied: true,
        last_optimization: new Date().toISOString()
      })
      .eq('id', optimization.templateId);
  }

  static async rebalanceChannels(optimization, userId, companyId) {
    // Update channel priorities and allocations
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    await supabase
      .from('channel_allocations')
      .upsert(optimization.channelBalances.map(balance => ({
        channel: balance.channel,
        allocation_percentage: balance.percentage,
        user_id: userId,
        company_id: companyId,
        updated_at: new Date().toISOString()
      })));
  }

  static async modifySequence(optimization, userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    await supabase
      .from('automation_sequences')
      .update({
        steps: optimization.modifiedSteps,
        optimization_applied: true,
        modification_reason: optimization.reason,
        last_modified: new Date().toISOString()
      })
      .eq('id', optimization.sequenceId);
  }

  static async retryFailedAction(action, userId, companyId) {
    // Retry the failed action with improved parameters
    await TriggerHandlers.executeAction(action.originalAction, action.improvedParams, userId, companyId);
  }

  static async executeFallbackChannel(action, userId, companyId) {
    // Execute on fallback channel (e.g., SMS if email fails)
    switch (action.fallbackChannel) {
      case 'sms':
        const { smsSequences } = await import('@/automations/native/smsSequences.js');
        await smsSequences.sendFallbackSMS(action.params, userId, companyId);
        break;
      case 'phone':
        await this.schedulePhoneCall(action.params, userId, companyId);
        break;
      default:
        logger.warn(`Unknown fallback channel: ${action.fallbackChannel}`, {}, 'ai_agent');
    }
  }

  static async escalateToHuman(action, userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        company_id: companyId,
        type: 'automation_escalation',
        title: 'Automation Requires Human Intervention',
        message: `${action.reason}: ${action.description}`,
        metadata: {
          automationId: action.automationId,
          leadId: action.leadId,
          urgency: action.urgency,
          escalationType: action.escalationType
        }
      });
  }

  static async logAndSkip(action, userId, companyId) {
    logger.warn('Automation action skipped', {
      action: action.type,
      reason: action.reason,
      leadId: action.leadId,
      automationId: action.automationId
    }, 'ai_agent');
  }

  static async getActiveAutomations(userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    const { data } = await supabase
      .from('automation_workflows')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('is_active', true);
    
    return data || [];
  }

  static async getPerformanceBenchmarks(userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    const { data } = await supabase
      .from('automation_performance')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(100);
    
    return data || [];
  }

  static async getFailurePatterns(userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    const { data } = await supabase
      .from('automation_failures')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    return data || [];
  }

  static async getOptimizationHistory(userId, companyId) {
    const { supabase } = await import('@/integrations/supabase/client.js');
    
    const { data } = await supabase
      .from('automation_optimizations')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    return data || [];
  }
}

export const automationAgentConfig = AutomationAgentConfig;
