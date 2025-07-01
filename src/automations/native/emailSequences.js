
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { scheduler } from '@/utils/scheduler';

export class EmailSequences {
  static async sendTemplatedEmail({ leadId, template, leadData, userId, companyId }) {
    try {
      const personalizedContent = this.personalizeContent(template.content, leadData);
      const personalizedSubject = this.personalizeContent(template.subject, leadData);

      const { data, error } = await supabase.functions.invoke('gmail-send', {
        body: {
          to: leadData.email,
          subject: personalizedSubject,
          body: personalizedContent,
          leadId,
          leadName: leadData.name,
          templateId: template.id
        }
      });

      if (error) throw error;

      // Log email sent
      await this.logEmailActivity({
        leadId,
        templateId: template.id,
        status: 'sent',
        userId,
        companyId
      });

      // Schedule follow-up if template has sequence
      if (template.follow_up_delay) {
        await this.scheduleFollowUp({
          leadId,
          templateId: template.id,
          delay: template.follow_up_delay,
          userId,
          companyId
        });
      }

      return { success: true, messageId: data.messageId };
    } catch (error) {
      logger.error('Failed to send templated email', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async startNurtureSequence({ leadId, leadData, sequenceType, userId, companyId }) {
    try {
      const sequence = await this.getSequence(sequenceType);
      if (!sequence) {
        throw new Error(`Sequence not found: ${sequenceType}`);
      }

      // Start sequence
      await supabase
        .from('nurture_sequences')
        .insert({
          lead_id: leadId,
          sequence_type: sequenceType,
          current_step: 0,
          status: 'active',
          started_at: new Date().toISOString(),
          user_id: userId,
          company_id: companyId
        });

      // Schedule first step
      await this.scheduleSequenceStep({
        leadId,
        sequenceType,
        stepIndex: 0,
        delay: sequence.steps[0].delay || 0,
        userId,
        companyId
      });

      return { success: true, message: 'Nurture sequence started' };
    } catch (error) {
      logger.error('Failed to start nurture sequence', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async processSequenceStep({ leadId, sequenceType, stepIndex, userId, companyId }) {
    try {
      const sequence = await this.getSequence(sequenceType);
      const step = sequence.steps[stepIndex];

      if (!step) {
        await this.completeSequence(leadId, sequenceType);
        return { success: true, message: 'Sequence completed' };
      }

      // Execute step based on type
      let result;
      switch (step.type) {
        case 'email':
          result = await this.sendSequenceEmail(leadId, step, userId, companyId);
          break;
        case 'sms':
          result = await this.sendSequenceSMS(leadId, step, userId, companyId);
          break;
        case 'wait':
          result = { success: true, message: 'Wait step processed' };
          break;
        default:
          throw new Error(`Unknown step type: ${step.type}`);
      }

      if (result.success) {
        // Update sequence progress
        await supabase
          .from('nurture_sequences')
          .update({ current_step: stepIndex + 1 })
          .eq('lead_id', leadId)
          .eq('sequence_type', sequenceType);

        // Schedule next step
        const nextStep = sequence.steps[stepIndex + 1];
        if (nextStep) {
          await this.scheduleSequenceStep({
            leadId,
            sequenceType,
            stepIndex: stepIndex + 1,
            delay: nextStep.delay || 24 * 60 * 60 * 1000, // Default 24 hours
            userId,
            companyId
          });
        }
      }

      return result;
    } catch (error) {
      logger.error('Failed to process sequence step', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static personalizeContent(content, leadData) {
    let personalized = content;
    
    // Replace common variables
    personalized = personalized.replace(/\{\{name\}\}/g, leadData.name || 'there');
    personalized = personalized.replace(/\{\{company\}\}/g, leadData.company || 'your company');
    personalized = personalized.replace(/\{\{email\}\}/g, leadData.email || '');
    personalized = personalized.replace(/\{\{phone\}\}/g, leadData.phone || '');
    personalized = personalized.replace(/\{\{industry\}\}/g, leadData.industry || 'your industry');
    
    return personalized;
  }

  static async getSequence(sequenceType) {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('type', sequenceType)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      logger.error('Failed to get sequence', error, 'automation');
      return null;
    }
  }

  static async scheduleFollowUp({ leadId, templateId, delay, userId, companyId }) {
    await scheduler.scheduleTask({
      taskType: 'email_followup',
      delay,
      data: { leadId, templateId },
      userId,
      companyId
    });
  }

  static async scheduleSequenceStep({ leadId, sequenceType, stepIndex, delay, userId, companyId }) {
    await scheduler.scheduleTask({
      taskType: 'sequence_step',
      delay,
      data: { leadId, sequenceType, stepIndex },
      userId,
      companyId
    });
  }

  static async logEmailActivity({ leadId, templateId, status, userId, companyId }) {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'email_automation',
          event_summary: `Email ${status}`,
          payload: {
            leadId,
            templateId,
            status,
            timestamp: new Date().toISOString()
          },
          company_id: companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Failed to log email activity', error, 'automation');
    }
  }

  static async completeSequence(leadId, sequenceType) {
    await supabase
      .from('nurture_sequences')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('lead_id', leadId)
      .eq('sequence_type', sequenceType);
  }

  static async sendSequenceEmail(leadId, step, userId, companyId) {
    try {
      const { data: leadData } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      const personalizedContent = this.personalizeContent(step.content, leadData);
      const personalizedSubject = this.personalizeContent(step.subject, leadData);

      const { data, error } = await supabase.functions.invoke('gmail-send', {
        body: {
          to: leadData.email,
          subject: personalizedSubject,
          body: personalizedContent,
          leadId,
          leadName: leadData.name
        }
      });

      if (error) throw error;

      return { success: true, messageId: data.messageId };
    } catch (error) {
      logger.error('Failed to send sequence email', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async sendSequenceSMS(leadId, step, userId, companyId) {
    try {
      const { data: leadData } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (!leadData.phone) {
        return { success: false, error: 'No phone number available' };
      }

      const personalizedMessage = this.personalizeContent(step.content, leadData);

      const { data, error } = await supabase.functions.invoke('twilio-sms', {
        body: {
          to: leadData.phone,
          message: personalizedMessage,
          leadId
        }
      });

      if (error) throw error;

      return { success: true, messageId: data.messageId };
    } catch (error) {
      logger.error('Failed to send sequence SMS', error, 'automation');
      return { success: false, error: error.message };
    }
  }
}

export const emailSequences = EmailSequences;
