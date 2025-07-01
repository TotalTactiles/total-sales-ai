
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { scheduler } from '@/utils/scheduler';

export class SMSSequences {
  static async sendSMSSequence({ leadId, leadData, sequenceType, userId, companyId }) {
    try {
      if (!leadData.phone) {
        return { success: false, error: 'No phone number available for SMS' };
      }

      const sequence = await this.getSMSSequence(sequenceType);
      if (!sequence) {
        throw new Error(`SMS sequence not found: ${sequenceType}`);
      }

      // Send first SMS
      const firstMessage = this.personalizeMessage(sequence.messages[0], leadData);
      
      const { data, error } = await supabase.functions.invoke('twilio-sms', {
        body: {
          to: leadData.phone,
          message: firstMessage,
          leadId,
          sequenceType
        }
      });

      if (error) throw error;

      // Schedule follow-up messages
      if (sequence.messages.length > 1) {
        await this.scheduleFollowUpMessages({
          leadId,
          sequenceType,
          messages: sequence.messages.slice(1),
          leadData,
          userId,
          companyId
        });
      }

      // Log SMS activity
      await this.logSMSActivity({
        leadId,
        sequenceType,
        status: 'sent',
        messageCount: sequence.messages.length,
        userId,
        companyId
      });

      return { success: true, messageId: data.messageId };
    } catch (error) {
      logger.error('Failed to send SMS sequence', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async sendFallbackSMS({ leadId, leadData, reason, userId, companyId }) {
    try {
      if (!leadData.phone) {
        return { success: false, error: 'No phone number available for fallback SMS' };
      }

      const fallbackMessage = this.getFallbackMessage(reason, leadData);
      
      const { data, error } = await supabase.functions.invoke('twilio-sms', {
        body: {
          to: leadData.phone,
          message: fallbackMessage,
          leadId,
          reason: 'email_fallback'
        }
      });

      if (error) throw error;

      await this.logSMSActivity({
        leadId,
        sequenceType: 'fallback',
        status: 'sent',
        reason,
        userId,
        companyId
      });

      return { success: true, messageId: data.messageId };
    } catch (error) {
      logger.error('Failed to send fallback SMS', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async handleSMSResponse({ leadId, phoneNumber, message, userId, companyId }) {
    try {
      // Log the response
      await supabase
        .from('sms_responses')
        .insert({
          lead_id: leadId,
          phone_number: phoneNumber,
          message,
          received_at: new Date().toISOString(),
          user_id: userId,
          company_id: companyId
        });

      // Analyze sentiment and trigger appropriate follow-up
      const sentiment = this.analyzeSentiment(message);
      
      if (sentiment === 'positive') {
        await this.triggerPositiveResponse(leadId, userId, companyId);
      } else if (sentiment === 'negative') {
        await this.triggerNegativeResponse(leadId, userId, companyId);
      }

      return { success: true, sentiment };
    } catch (error) {
      logger.error('Failed to handle SMS response', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static personalizeMessage(message, leadData) {
    let personalized = message;
    
    personalized = personalized.replace(/\{\{name\}\}/g, leadData.name || 'there');
    personalized = personalized.replace(/\{\{company\}\}/g, leadData.company || 'your company');
    personalized = personalized.replace(/\{\{industry\}\}/g, leadData.industry || 'your industry');
    
    return personalized;
  }

  static getFallbackMessage(reason, leadData) {
    const messages = {
      'email_bounce': `Hi ${leadData.name || 'there'}, we had trouble reaching you by email. Are you still interested in learning more about our solution?`,
      'no_email_response': `Hi ${leadData.name || 'there'}, just wanted to follow up on our previous conversation. Would you like to schedule a quick call?`,
      'email_undelivered': `Hi ${leadData.name || 'there'}, we wanted to make sure you received our information. Can we help answer any questions?`
    };
    
    return messages[reason] || `Hi ${leadData.name || 'there'}, we wanted to follow up with you. Please let us know if you have any questions.`;
  }

  static async getSMSSequence(sequenceType) {
    try {
      const { data, error } = await supabase
        .from('sms_sequences')
        .select('*')
        .eq('type', sequenceType)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      logger.error('Failed to get SMS sequence', error, 'automation');
      return null;
    }
  }

  static async scheduleFollowUpMessages({ leadId, sequenceType, messages, leadData, userId, companyId }) {
    for (let i = 0; i < messages.length; i++) {
      const delay = (i + 1) * 24 * 60 * 60 * 1000; // 24 hours between messages
      
      await scheduler.scheduleTask({
        taskType: 'sms_followup',
        delay,
        data: {
          leadId,
          sequenceType,
          messageIndex: i + 1,
          message: messages[i],
          leadData
        },
        userId,
        companyId
      });
    }
  }

  static async logSMSActivity({ leadId, sequenceType, status, messageCount, reason, userId, companyId }) {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'sms_automation',
          event_summary: `SMS ${status}`,
          payload: {
            leadId,
            sequenceType,
            status,
            messageCount,
            reason,
            timestamp: new Date().toISOString()
          },
          company_id: companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Failed to log SMS activity', error, 'automation');
    }
  }

  static analyzeSentiment(message) {
    const positiveWords = ['yes', 'interested', 'great', 'sounds good', 'tell me more', 'call me'];
    const negativeWords = ['no', 'not interested', 'stop', 'remove', 'unsubscribe', 'don\'t'];
    
    const lowerMessage = message.toLowerCase();
    
    const hasPositive = positiveWords.some(word => lowerMessage.includes(word));
    const hasNegative = negativeWords.some(word => lowerMessage.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  static async triggerPositiveResponse(leadId, userId, companyId) {
    // Schedule immediate follow-up call
    await scheduler.scheduleTask({
      taskType: 'sales_call',
      delay: 30 * 60 * 1000, // 30 minutes
      data: { leadId, reason: 'positive_sms_response' },
      userId,
      companyId
    });

    // Update lead status
    await supabase
      .from('leads')
      .update({ 
        status: 'hot_lead',
        last_positive_interaction: new Date().toISOString()
      })
      .eq('id', leadId);
  }

  static async triggerNegativeResponse(leadId, userId, companyId) {
    // Mark lead as not interested
    await supabase
      .from('leads')
      .update({ 
        status: 'not_interested',
        last_negative_interaction: new Date().toISOString()
      })
      .eq('id', leadId);

    // Stop all active sequences
    await supabase
      .from('nurture_sequences')
      .update({ status: 'stopped' })
      .eq('lead_id', leadId)
      .eq('status', 'active');
  }
}

export const smsSequences = SMSSequences;
