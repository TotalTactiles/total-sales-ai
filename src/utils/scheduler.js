
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export class Scheduler {
  static scheduledTasks = new Map();

  static async scheduleTask({ taskType, delay, data, userId, companyId }) {
    try {
      const taskId = crypto.randomUUID();
      const executeAt = new Date(Date.now() + delay);

      // Store task in database for persistence
      await supabase
        .from('scheduled_tasks')
        .insert({
          id: taskId,
          task_type: taskType,
          execute_at: executeAt.toISOString(),
          data,
          user_id: userId,
          company_id: companyId,
          status: 'scheduled'
        });

      // Schedule in-memory execution
      const timeoutId = setTimeout(async () => {
        await this.executeTask(taskId, taskType, data, userId, companyId);
      }, delay);

      this.scheduledTasks.set(taskId, {
        timeoutId,
        taskType,
        executeAt,
        data
      });

      logger.info('Task scheduled', { taskId, taskType, delay }, 'scheduler');
      return taskId;
    } catch (error) {
      logger.error('Failed to schedule task', error, 'scheduler');
      throw error;
    }
  }

  static async executeTask(taskId, taskType, data, userId, companyId) {
    try {
      logger.info('Executing scheduled task', { taskId, taskType }, 'scheduler');

      // Update task status
      await supabase
        .from('scheduled_tasks')
        .update({ 
          status: 'executing',
          executed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      let result;
      switch (taskType) {
        case 'lead_followup':
          result = await this.executeLeadFollowup(data, userId, companyId);
          break;
        case 'email_followup':
          result = await this.executeEmailFollowup(data, userId, companyId);
          break;
        case 'sequence_step':
          result = await this.executeSequenceStep(data, userId, companyId);
          break;
        case 'sms_followup':
          result = await this.executeSMSFollowup(data, userId, companyId);
          break;
        case 'payment_reminder':
          result = await this.executePaymentReminder(data, userId, companyId);
          break;
        case 'agent_followup':
          result = await this.executeAgentFollowup(data, userId, companyId);
          break;
        case 'sales_call':
          result = await this.executeSalesCall(data, userId, companyId);
          break;
        case 'retargeting_email':
          result = await this.executeRetargetingEmail(data, userId, companyId);
          break;
        case 'retargeting_sms':
          result = await this.executeRetargingSMS(data, userId, companyId);
          break;
        case 'heat_score_update':
          result = await this.executeHeatScoreUpdate(data, userId, companyId);
          break;
        default:
          throw new Error(`Unknown task type: ${taskType}`);
      }

      // Update task with result
      await supabase
        .from('scheduled_tasks')
        .update({ 
          status: result.success ? 'completed' : 'failed',
          result: result,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      // Clean up in-memory reference
      this.scheduledTasks.delete(taskId);

      logger.info('Task executed', { taskId, success: result.success }, 'scheduler');
      return result;
    } catch (error) {
      logger.error('Task execution failed', error, 'scheduler');
      
      await supabase
        .from('scheduled_tasks')
        .update({ 
          status: 'failed',
          error: error.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      return { success: false, error: error.message };
    }
  }

  static async executeLeadFollowup(data, userId, companyId) {
    const { TriggerHandlers } = await import('../automations/native/triggerHandlers.js');
    
    // Get updated lead data
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.leadId)
      .single();

    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }

    // Execute appropriate follow-up based on tag
    return await TriggerHandlers.handleLeadTagTrigger({
      leadId: data.leadId,
      tag: data.tag,
      leadData,
      userId,
      companyId
    });
  }

  static async executeEmailFollowup(data, userId, companyId) {
    const { emailSequences } = await import('../automations/native/emailSequences.js');
    
    // Get template and lead data
    const [templateResult, leadResult] = await Promise.all([
      supabase.from('email_templates').select('*').eq('id', data.templateId).single(),
      supabase.from('leads').select('*').eq('id', data.leadId).single()
    ]);

    if (!templateResult.data || !leadResult.data) {
      return { success: false, error: 'Template or lead not found' };
    }

    return await emailSequences.sendTemplatedEmail({
      leadId: data.leadId,
      template: templateResult.data,
      leadData: leadResult.data,
      userId,
      companyId
    });
  }

  static async executeSequenceStep(data, userId, companyId) {
    const { emailSequences } = await import('../automations/native/emailSequences.js');
    
    return await emailSequences.processSequenceStep({
      leadId: data.leadId,
      sequenceType: data.sequenceType,
      stepIndex: data.stepIndex,
      userId,
      companyId
    });
  }

  static async executeSMSFollowup(data, userId, companyId) {
    const { smsSequences } = await import('../automations/native/smsSequences.js');
    
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.leadId)
      .single();

    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }

    const personalizedMessage = data.message.replace(/\{\{name\}\}/g, leadData.name || 'there');

    const { data: result, error } = await supabase.functions.invoke('twilio-sms', {
      body: {
        to: leadData.phone,
        message: personalizedMessage,
        leadId: data.leadId
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: result.messageId };
  }

  static async executePaymentReminder(data, userId, companyId) {
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.leadId)
      .single();

    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }

    const reminderMessage = `Hi ${leadData.name}, this is a friendly reminder about your contract. Please let us know if you have any questions about the payment process.`;

    const { data: result, error } = await supabase.functions.invoke('gmail-send', {
      body: {
        to: leadData.email,
        subject: `Payment Reminder - ${leadData.company}`,
        body: reminderMessage,
        leadId: data.leadId,
        leadName: leadData.name
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Schedule next reminder if needed
    if (data.reminderCount < 3) {
      await this.scheduleTask({
        taskType: 'payment_reminder',
        delay: 48 * 60 * 60 * 1000, // 48 hours
        data: { ...data, reminderCount: data.reminderCount + 1 },
        userId,
        companyId
      });
    }

    return { success: true, messageId: result.messageId };
  }

  static async executeAgentFollowup(data, userId, companyId) {
    // Create notification for agent
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        company_id: companyId,
        type: 'agent_followup',
        title: 'Agent Follow-up Required',
        message: `Follow-up needed for lead regarding: ${data.reason}`,
        metadata: {
          leadId: data.leadId,
          reason: data.reason,
          contractData: data.contractData
        }
      });

    return { success: true, message: 'Agent follow-up notification created' };
  }

  static async executeSalesCall(data, userId, companyId) {
    // Create high-priority notification for sales call
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        company_id: companyId,
        type: 'sales_call',
        title: 'Sales Call Required',
        message: `Urgent: Call needed for lead due to ${data.reason}`,
        metadata: {
          leadId: data.leadId,
          reason: data.reason,
          priority: 'high'
        }
      });

    return { success: true, message: 'Sales call notification created' };
  }

  static async executeRetargetingEmail(data, userId, companyId) {
    const { retargeting } = await import('../automations/native/retargeting.js');
    
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.leadId)
      .single();

    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }

    // Calculate inactivity days
    const lastInteraction = new Date(leadData.last_interaction || leadData.created_at);
    const inactivityDays = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24);

    return await retargeting.executeEmailRewarming(data.leadId, leadData, 
      retargeting.getRetargetingStrategy(inactivityDays), userId, companyId);
  }

  static async executeRetargingSMS(data, userId, companyId) {
    const { retargeting } = await import('../automations/native/retargeting.js');
    
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.leadId)
      .single();

    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }

    const lastInteraction = new Date(leadData.last_interaction || leadData.created_at);
    const inactivityDays = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24);

    return await retargeting.executeSMSRewarming(data.leadId, leadData, 
      retargeting.getRetargetingStrategy(inactivityDays), userId, companyId);
  }

  static async executeHeatScoreUpdate(data, userId, companyId) {
    const { retargeting } = await import('../automations/native/retargeting.js');
    
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.leadId)
      .single();

    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }

    const newHeatScore = await retargeting.calculateLeadHeatScore(data.leadId, leadData);
    
    await supabase
      .from('leads')
      .update({ heat_score: newHeatScore })
      .eq('id', data.leadId);

    return { success: true, newHeatScore };
  }

  static async cancelTask(taskId) {
    const task = this.scheduledTasks.get(taskId);
    if (task) {
      clearTimeout(task.timeoutId);
      this.scheduledTasks.delete(taskId);
      
      await supabase
        .from('scheduled_tasks')
        .update({ status: 'cancelled' })
        .eq('id', taskId);
      
      return true;
    }
    return false;
  }

  static async getScheduledTasks(userId, companyId) {
    const { data, error } = await supabase
      .from('scheduled_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('status', 'scheduled')
      .order('execute_at', { ascending: true });

    if (error) {
      logger.error('Failed to get scheduled tasks', error, 'scheduler');
      return [];
    }

    return data;
  }
}

export const scheduler = Scheduler;
