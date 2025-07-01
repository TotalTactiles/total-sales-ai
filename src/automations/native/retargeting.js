
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { scheduler } from '@/utils/scheduler';
import { emailSequences } from './emailSequences';
import { smsSequences } from './smsSequences';

export class Retargeting {
  static async startRewarming({ leadId, leadData, inactivityDays, userId, companyId }) {
    try {
      logger.info('Starting rewarming workflow', { leadId, inactivityDays }, 'automation');

      // Determine rewarming strategy based on inactivity period
      const strategy = this.getRetargetingStrategy(inactivityDays);
      
      // Execute multi-channel rewarming
      const results = await Promise.allSettled([
        this.executeEmailRewarming(leadId, leadData, strategy, userId, companyId),
        this.executeSMSRewarming(leadId, leadData, strategy, userId, companyId),
        this.executeSocialRewarming(leadId, leadData, strategy, userId, companyId)
      ]);

      // Calculate lead heat score
      const heatScore = await this.calculateLeadHeatScore(leadId, leadData);
      
      // Update lead with new heat score and rewarming status
      await supabase
        .from('leads')
        .update({
          heat_score: heatScore,
          last_rewarming: new Date().toISOString(),
          rewarming_strategy: strategy.name,
          status: heatScore > 70 ? 'warm_lead' : 'cold_lead'
        })
        .eq('id', leadId);

      // Log rewarming activity
      await this.logRetargetingActivity({
        leadId,
        strategy: strategy.name,
        heatScore,
        results: results.map(r => r.status),
        userId,
        companyId
      });

      return {
        success: true,
        strategy: strategy.name,
        heatScore,
        channelsActivated: results.filter(r => r.status === 'fulfilled').length
      };
    } catch (error) {
      logger.error('Rewarming workflow failed', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async executeEmailRewarming(leadId, leadData, strategy, userId, companyId) {
    try {
      // Start rewarming email sequence
      await emailSequences.startNurtureSequence({
        leadId,
        leadData,
        sequenceType: strategy.emailSequence,
        userId,
        companyId
      });

      return { success: true, channel: 'email' };
    } catch (error) {
      logger.error('Email rewarming failed', error, 'automation');
      return { success: false, channel: 'email', error: error.message };
    }
  }

  static async executeSMSRewarming(leadId, leadData, strategy, userId, companyId) {
    try {
      if (!leadData.phone) {
        return { success: false, channel: 'sms', error: 'No phone number available' };
      }

      // Send rewarming SMS sequence
      await smsSequences.sendSMSSequence({
        leadId,
        leadData,
        sequenceType: strategy.smsSequence,
        userId,
        companyId
      });

      return { success: true, channel: 'sms' };
    } catch (error) {
      logger.error('SMS rewarming failed', error, 'automation');
      return { success: false, channel: 'sms', error: error.message };
    }
  }

  static async executeSocialRewarming(leadId, leadData, strategy, userId, companyId) {
    try {
      // Generate social media prompts for manual execution
      const socialPrompts = this.generateSocialPrompts(leadData, strategy);
      
      // Store prompts for user to execute
      await supabase
        .from('social_rewarming_prompts')
        .insert({
          lead_id: leadId,
          prompts: socialPrompts,
          strategy: strategy.name,
          created_at: new Date().toISOString(),
          user_id: userId,
          company_id: companyId
        });

      // Create notification for user
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          company_id: companyId,
          type: 'social_rewarming',
          title: 'Social Rewarming Prompts Ready',
          message: `Social media rewarming prompts generated for ${leadData.name}`,
          metadata: {
            leadId,
            promptCount: socialPrompts.length
          }
        });

      return { success: true, channel: 'social', promptCount: socialPrompts.length };
    } catch (error) {
      logger.error('Social rewarming failed', error, 'automation');
      return { success: false, channel: 'social', error: error.message };
    }
  }

  static getRetargetingStrategy(inactivityDays) {
    if (inactivityDays <= 7) {
      return {
        name: 'gentle_nudge',
        emailSequence: 'gentle_reengagement',
        smsSequence: 'soft_check_in',
        socialFrequency: 'weekly',
        intensity: 'low'
      };
    } else if (inactivityDays <= 30) {
      return {
        name: 'moderate_reengagement',
        emailSequence: 'value_driven_reengagement',
        smsSequence: 'benefit_reminder',
        socialFrequency: 'bi_weekly',
        intensity: 'medium'
      };
    } else if (inactivityDays <= 90) {
      return {
        name: 'aggressive_rewarming',
        emailSequence: 'last_chance_sequence',
        smsSequence: 'urgent_follow_up',
        socialFrequency: 'daily',
        intensity: 'high'
      };
    } else {
      return {
        name: 'dormant_reactivation',
        emailSequence: 'dormant_reactivation',
        smsSequence: 'reintroduction',
        socialFrequency: 'monthly',
        intensity: 'maximum'
      };
    }
  }

  static async calculateLeadHeatScore(leadId, leadData) {
    try {
      let score = 0;

      // Base score from lead data
      if (leadData.email) score += 10;
      if (leadData.phone) score += 10;
      if (leadData.company) score += 15;
      if (leadData.industry) score += 5;

      // Interaction history score
      const { data: interactions } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (interactions) {
        // Recent interactions boost score
        const recentInteractions = interactions.filter(
          i => new Date(i.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        score += recentInteractions.length * 5;

        // Positive interactions boost score more
        const positiveInteractions = interactions.filter(
          i => i.type === 'email_opened' || i.type === 'link_clicked' || i.type === 'call_answered'
        );
        score += positiveInteractions.length * 3;
      }

      // Engagement velocity
      const engagementVelocity = await this.calculateEngagementVelocity(leadId);
      score += Math.min(engagementVelocity * 2, 30);

      // Company size and revenue potential
      if (leadData.employees) {
        if (leadData.employees > 1000) score += 20;
        else if (leadData.employees > 100) score += 15;
        else if (leadData.employees > 10) score += 10;
      }

      return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
    } catch (error) {
      logger.error('Failed to calculate heat score', error, 'automation');
      return 50; // Default score
    }
  }

  static async calculateEngagementVelocity(leadId) {
    try {
      const { data: interactions } = await supabase
        .from('lead_interactions')
        .select('created_at')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!interactions || interactions.length < 2) return 0;

      const timeSpan = new Date(interactions[0].created_at) - new Date(interactions[interactions.length - 1].created_at);
      const days = timeSpan / (1000 * 60 * 60 * 24);
      
      return interactions.length / Math.max(days, 1);
    } catch (error) {
      logger.error('Failed to calculate engagement velocity', error, 'automation');
      return 0;
    }
  }

  static generateSocialPrompts(leadData, strategy) {
    const prompts = [];

    // LinkedIn prompts
    prompts.push({
      platform: 'linkedin',
      action: 'connection_request',
      content: `Hi ${leadData.name}, I noticed we haven't connected yet. I'd love to stay in touch and share relevant industry insights with you.`,
      timing: 'immediate'
    });

    prompts.push({
      platform: 'linkedin',
      action: 'message',
      content: `Hi ${leadData.name}, I came across an interesting article about ${leadData.industry} trends that I thought you might find valuable. Would you like me to share it?`,
      timing: '3_days'
    });

    // Twitter prompts
    if (leadData.twitter_handle) {
      prompts.push({
        platform: 'twitter',
        action: 'mention',
        content: `Great insights from @${leadData.twitter_handle} on ${leadData.industry} challenges. Looking forward to more discussions!`,
        timing: 'weekly'
      });
    }

    // Facebook prompts
    prompts.push({
      platform: 'facebook',
      action: 'page_follow',
      content: `Follow and engage with ${leadData.company}'s Facebook page`,
      timing: 'immediate'
    });

    return prompts;
  }

  static async scheduleRetargetingTasks(leadId, strategy, userId, companyId) {
    const tasks = [
      {
        taskType: 'retargeting_email',
        delay: 24 * 60 * 60 * 1000, // 24 hours
        data: { leadId, action: 'send_reengagement_email' }
      },
      {
        taskType: 'retargeting_sms',
        delay: 72 * 60 * 60 * 1000, // 72 hours
        data: { leadId, action: 'send_check_in_sms' }
      },
      {
        taskType: 'heat_score_update',
        delay: 7 * 24 * 60 * 60 * 1000, // 7 days
        data: { leadId, action: 'recalculate_heat_score' }
      }
    ];

    for (const task of tasks) {
      await scheduler.scheduleTask({
        ...task,
        userId,
        companyId
      });
    }
  }

  static async logRetargetingActivity({ leadId, strategy, heatScore, results, userId, companyId }) {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'retargeting_automation',
          event_summary: `Retargeting workflow: ${strategy}`,
          payload: {
            leadId,
            strategy,
            heatScore,
            results,
            timestamp: new Date().toISOString()
          },
          company_id: companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Failed to log retargeting activity', error, 'automation');
    }
  }
}

export const retargeting = Retargeting;
