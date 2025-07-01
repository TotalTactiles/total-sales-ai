
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { scheduler } from '@/utils/scheduler';
import { emailSequences } from './emailSequences';
import { smsSequences } from './smsSequences';
import { crmSync } from './crmSync';
import { retargeting } from './retargeting';

export class TriggerHandlers {
  static async handleLeadTagTrigger({ leadId, tag, leadData, userId, companyId }) {
    try {
      logger.info('Lead tag trigger activated', { leadId, tag }, 'automation');
      
      // Trigger templated email based on tag
      const emailTemplate = await this.getEmailTemplateByTag(tag);
      if (emailTemplate) {
        await emailSequences.sendTemplatedEmail({
          leadId,
          template: emailTemplate,
          leadData,
          userId,
          companyId
        });
      }

      // Schedule follow-up based on tag priority
      const followUpDelay = this.getFollowUpDelay(tag);
      await scheduler.scheduleTask({
        taskType: 'lead_followup',
        delay: followUpDelay,
        data: { leadId, tag, originalTrigger: 'tag_assignment' },
        userId,
        companyId
      });

      // Log automation success
      await this.logAutomationEvent({
        type: 'lead_tag_trigger',
        status: 'success',
        leadId,
        data: { tag, followUpScheduled: true },
        userId,
        companyId
      });

      return { success: true, message: 'Lead tag automation triggered successfully' };
    } catch (error) {
      logger.error('Lead tag trigger failed', error, 'automation');
      await this.logAutomationEvent({
        type: 'lead_tag_trigger',
        status: 'failed',
        leadId,
        error: error.message,
        userId,
        companyId
      });
      return { success: false, error: error.message };
    }
  }

  static async handleContractSentTrigger({ leadId, contractData, userId, companyId }) {
    try {
      logger.info('Contract sent trigger activated', { leadId }, 'automation');

      // Start payment flow automation
      await scheduler.scheduleTask({
        taskType: 'payment_reminder',
        delay: 24 * 60 * 60 * 1000, // 24 hours
        data: { leadId, contractData, reminderCount: 1 },
        userId,
        companyId
      });

      // Assign agent follow-up
      await scheduler.scheduleTask({
        taskType: 'agent_followup',
        delay: 3 * 24 * 60 * 60 * 1000, // 3 days
        data: { leadId, contractData, reason: 'contract_sent_followup' },
        userId,
        companyId
      });

      // Update lead status
      await supabase
        .from('leads')
        .update({ 
          status: 'contract_sent',
          last_automation: new Date().toISOString()
        })
        .eq('id', leadId);

      return { success: true, message: 'Contract sent automation triggered' };
    } catch (error) {
      logger.error('Contract sent trigger failed', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async handleLeadClosedTrigger({ leadId, leadData, crmSelection, userId, companyId }) {
    try {
      logger.info('Lead closed trigger activated', { leadId, crmSelection }, 'automation');

      // Sync to selected CRM
      const syncResult = await crmSync.syncLeadToCRM({
        leadId,
        leadData,
        crmType: crmSelection,
        userId,
        companyId
      });

      if (!syncResult.success) {
        // Flag failure for Developer Agent
        await this.flagForDeveloperAgent({
          type: 'crm_sync_failure',
          leadId,
          error: syncResult.error,
          crmType: crmSelection,
          userId,
          companyId
        });
      }

      return syncResult;
    } catch (error) {
      logger.error('Lead closed trigger failed', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async handleColdLeadTrigger({ leadId, leadData, inactivityDays, userId, companyId }) {
    try {
      logger.info('Cold lead trigger activated', { leadId, inactivityDays }, 'automation');

      // Start retargeting workflow
      const retargetResult = await retargeting.startRewarming({
        leadId,
        leadData,
        inactivityDays,
        userId,
        companyId
      });

      return retargetResult;
    } catch (error) {
      logger.error('Cold lead trigger failed', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async getEmailTemplateByTag(tag) {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('trigger_tag', tag)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      logger.error('Failed to get email template', error, 'automation');
      return null;
    }
  }

  static getFollowUpDelay(tag) {
    const delayMap = {
      'hot_lead': 2 * 60 * 60 * 1000, // 2 hours
      'warm_lead': 24 * 60 * 60 * 1000, // 24 hours
      'cold_lead': 7 * 24 * 60 * 60 * 1000, // 7 days
      'interested': 4 * 60 * 60 * 1000, // 4 hours
      'demo_requested': 1 * 60 * 60 * 1000, // 1 hour
      'proposal_sent': 48 * 60 * 60 * 1000, // 48 hours
    };
    return delayMap[tag] || 24 * 60 * 60 * 1000; // Default 24 hours
  }

  static async logAutomationEvent({ type, status, leadId, data, error, userId, companyId }) {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'automation_trigger',
          event_summary: `${type}: ${status}`,
          payload: {
            automationType: type,
            status,
            leadId,
            data,
            error,
            timestamp: new Date().toISOString()
          },
          company_id: companyId,
          visibility: 'admin_only'
        });
    } catch (logError) {
      logger.error('Failed to log automation event', logError, 'automation');
    }
  }

  static async flagForDeveloperAgent({ type, leadId, error, crmType, userId, companyId }) {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          company_id: companyId,
          type: 'developer_alert',
          title: 'Automation Failure',
          message: `${type}: ${error}`,
          metadata: {
            leadId,
            crmType,
            automationType: type,
            requiresDevAttention: true
          }
        });
    } catch (flagError) {
      logger.error('Failed to flag for developer agent', flagError, 'automation');
    }
  }
}
