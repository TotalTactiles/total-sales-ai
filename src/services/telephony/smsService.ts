
import { supabase } from '@/integrations/supabase/client';

export interface SMSConversation {
  id: string;
  company_id: string;
  user_id: string;
  lead_id?: string;
  phone_number: string;
  thread_id?: string;
  direction: 'inbound' | 'outbound';
  message_sid: string;
  body: string;
  media_urls?: string[];
  status: 'sent' | 'delivered' | 'failed' | 'received';
  error_message?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export class SMSService {
  static async createSMSMessage(messageData: Omit<SMSConversation, 'id' | 'created_at' | 'updated_at'>): Promise<SMSConversation | null> {
    const { data, error } = await supabase
      .from('sms_conversations')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error creating SMS message:', error);
      return null;
    }

    return data;
  }

  static async updateSMSMessage(messageId: string, updates: Partial<SMSConversation>): Promise<SMSConversation | null> {
    const { data, error } = await supabase
      .from('sms_conversations')
      .update(updates)
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      console.error('Error updating SMS message:', error);
      return null;
    }

    return data;
  }

  static async getSMSConversation(phoneNumber: string, companyId: string): Promise<SMSConversation[]> {
    const { data, error } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching SMS conversation:', error);
      return [];
    }

    return data || [];
  }

  static async sendSMS(
    phoneNumber: string,
    message: string,
    userId: string,
    companyId: string,
    leadId?: string
  ): Promise<{ success: boolean; messageSid?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: phoneNumber,
          message,
          userId,
          companyId,
          leadId
        }
      });

      if (error) throw error;

      return { success: true, messageSid: data.messageSid };
    } catch (error) {
      console.error('SMS send error:', error);
      return { success: false, error: error.message };
    }
  }

  static subscribeToSMSConversation(phoneNumber: string, callback: (message: SMSConversation) => void) {
    return supabase
      .channel(`sms_${phoneNumber}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sms_conversations',
          filter: `phone_number=eq.${phoneNumber}`
        },
        (payload) => callback(payload.new as SMSConversation)
      )
      .subscribe();
  }

  static subscribeToCompanySMS(companyId: string, callback: (message: SMSConversation) => void) {
    return supabase
      .channel(`company_sms_${companyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sms_conversations',
          filter: `company_id=eq.${companyId}`
        },
        (payload) => callback(payload.new as SMSConversation)
      )
      .subscribe();
  }
}
