
import { supabase } from '@/integrations/supabase/client';

export interface DialerCampaign {
  id: string;
  company_id: string;
  user_id: string;
  name: string;
  lead_filters: Record<string, any>;
  call_script?: string;
  max_attempts: number;
  retry_delay_minutes: number;
  working_hours_start: string;
  working_hours_end: string;
  timezone: string;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface DialerQueueItem {
  id: string;
  campaign_id: string;
  lead_id: string;
  phone_number: string;
  priority: number;
  attempts: number;
  last_attempt_at?: string;
  next_attempt_at?: string;
  status: 'pending' | 'calling' | 'completed' | 'failed' | 'skipped';
  created_at: string;
}

export class DialerService {
  static async createCampaign(campaignData: Omit<DialerCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<DialerCampaign | null> {
    const { data, error } = await supabase
      .from('dialer_campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) {
      console.error('Error creating dialer campaign:', error);
      return null;
    }

    return data;
  }

  static async addToQueue(queueData: Omit<DialerQueueItem, 'id' | 'created_at'>): Promise<DialerQueueItem | null> {
    const { data, error } = await supabase
      .from('dialer_queue')
      .insert(queueData)
      .select()
      .single();

    if (error) {
      console.error('Error adding to dialer queue:', error);
      return null;
    }

    return data;
  }

  static async getNextQueueItem(campaignId: string): Promise<DialerQueueItem | null> {
    const { data, error } = await supabase
      .from('dialer_queue')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')
      .or(`next_attempt_at.is.null,next_attempt_at.lte.${new Date().toISOString()}`)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching next queue item:', error);
      return null;
    }

    return data;
  }

  static async updateQueueItem(queueId: string, updates: Partial<DialerQueueItem>): Promise<DialerQueueItem | null> {
    const { data, error } = await supabase
      .from('dialer_queue')
      .update(updates)
      .eq('id', queueId)
      .select()
      .single();

    if (error) {
      console.error('Error updating queue item:', error);
      return null;
    }

    return data;
  }

  static async getCampaignQueue(campaignId: string, status?: string): Promise<DialerQueueItem[]> {
    let query = supabase
      .from('dialer_queue')
      .select('*')
      .eq('campaign_id', campaignId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching campaign queue:', error);
      return [];
    }

    return data || [];
  }

  static async startDialing(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('start-dialer', {
        body: { campaignId }
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error starting dialer:', error);
      return { success: false, error: error.message };
    }
  }

  static async pauseDialing(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('dialer_campaigns')
        .update({ status: 'paused' })
        .eq('id', campaignId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error pausing dialer:', error);
      return { success: false, error: error.message };
    }
  }
}
