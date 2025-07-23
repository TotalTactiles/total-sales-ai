
import { supabase } from '@/integrations/supabase/client';
import { SMSService, SMSConversation } from './smsService';

export interface SMSThread {
  thread_id: string;
  messages: SMSConversation[];
  participant_count: number;
  last_message_at: string;
  unread_count: number;
}

export interface SMSTemplate {
  id: string;
  company_id: string;
  name: string;
  content: string;
  variables: string[];
  category: string;
  created_at: string;
}

export class EnhancedSMSService extends SMSService {
  static async createThread(
    phoneNumber: string,
    companyId: string,
    leadId?: string
  ): Promise<string> {
    const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store thread metadata
    const { error } = await supabase
      .from('sms_threads')
      .insert({
        thread_id: threadId,
        phone_number: phoneNumber,
        company_id: companyId,
        lead_id: leadId,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating SMS thread:', error);
      return `fallback_${Date.now()}`;
    }

    return threadId;
  }

  static async getThreadMessages(threadId: string): Promise<SMSConversation[]> {
    const { data, error } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching thread messages:', error);
      return [];
    }

    return data || [];
  }

  static async getCompanyThreads(companyId: string): Promise<SMSThread[]> {
    const { data, error } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching company threads:', error);
      return [];
    }

    // Group messages by thread_id
    const threadMap = new Map<string, SMSConversation[]>();
    data?.forEach(message => {
      const threadId = message.thread_id || message.phone_number;
      if (!threadMap.has(threadId)) {
        threadMap.set(threadId, []);
      }
      threadMap.get(threadId)!.push(message);
    });

    // Convert to SMSThread objects
    return Array.from(threadMap.entries()).map(([threadId, messages]) => ({
      thread_id: threadId,
      messages,
      participant_count: new Set(messages.map(m => m.phone_number)).size,
      last_message_at: messages[messages.length - 1]?.created_at || '',
      unread_count: messages.filter(m => m.direction === 'inbound' && m.status === 'received').length
    }));
  }

  static async sendBulkSMS(
    phoneNumbers: string[],
    message: string,
    userId: string,
    companyId: string,
    templateId?: string
  ): Promise<{ success: number; failed: number; results: any[] }> {
    const results = [];
    let success = 0;
    let failed = 0;

    for (const phoneNumber of phoneNumbers) {
      try {
        const result = await this.sendSMS(phoneNumber, message, userId, companyId);
        if (result.success) {
          success++;
          results.push({ phoneNumber, success: true, messageSid: result.messageSid });
        } else {
          failed++;
          results.push({ phoneNumber, success: false, error: result.error });
        }
      } catch (error) {
        failed++;
        results.push({ phoneNumber, success: false, error: error.message });
      }
    }

    // Log bulk SMS campaign
    await supabase
      .from('sms_campaigns')
      .insert({
        company_id: companyId,
        user_id: userId,
        template_id: templateId,
        recipient_count: phoneNumbers.length,
        success_count: success,
        failed_count: failed,
        message_content: message,
        created_at: new Date().toISOString()
      });

    return { success, failed, results };
  }

  static async createTemplate(
    companyId: string,
    name: string,
    content: string,
    category: string = 'general'
  ): Promise<SMSTemplate | null> {
    // Extract variables from template content (e.g., {{name}}, {{company}})
    const variables = content.match(/\{\{([^}]+)\}\}/g)?.map(match => 
      match.replace(/\{\{|\}\}/g, '')
    ) || [];

    const { data, error } = await supabase
      .from('sms_templates')
      .insert({
        company_id: companyId,
        name,
        content,
        variables,
        category
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating SMS template:', error);
      return null;
    }

    return data;
  }

  static async renderTemplate(
    templateId: string,
    variables: Record<string, string>
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from('sms_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Error fetching SMS template:', error);
      return null;
    }

    let renderedContent = data.content;
    
    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      renderedContent = renderedContent.replace(regex, value);
    });

    return renderedContent;
  }

  static async scheduleMessage(
    phoneNumber: string,
    message: string,
    userId: string,
    companyId: string,
    scheduledAt: string
  ): Promise<{ success: boolean; scheduleId?: string }> {
    try {
      const { data, error } = await supabase
        .from('scheduled_messages')
        .insert({
          phone_number: phoneNumber,
          message,
          user_id: userId,
          company_id: companyId,
          scheduled_at: scheduledAt,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, scheduleId: data.id };
    } catch (error) {
      console.error('Error scheduling message:', error);
      return { success: false };
    }
  }
}
